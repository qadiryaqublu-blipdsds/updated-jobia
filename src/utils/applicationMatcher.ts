import { Vacancy, CVData } from '../types';

export interface ApplicationMatchEvaluation {
  score: number;
  overallScore: number;
  highlights: string[];
}

/**
 * Calculates a multi-dimensional ATS match score between a candidate's CV/application and a job vacancy.
 * Evaluates skills, keywords, title relevance, experience depth, and cover note.
 */
export function calculateApplicationMatchScore(
  vacancy: Vacancy,
  cv?: CVData,
  attachment?: { name?: string; data?: string; type?: string } | null,
  coverNote?: string
): ApplicationMatchEvaluation {
  // If no CV and no attachment, minimal base score
  if (!cv && !attachment) {
    return {
      score: 15,
      overallScore: 15,
      highlights: ['Əsas əlaqə məlumatları daxil edilib'],
    };
  }

  let score = 30; // base score for having profile / attachments
  const highlights: string[] = [];

  if (cv) {
    const candidateSkills = (cv.skills || []).map((s) => s.name.toLowerCase());
    const requiredSkills = (vacancy.skills || []).map((s) => s.toLowerCase());

    // 1. Skill Matching
    if (requiredSkills.length > 0 && candidateSkills.length > 0) {
      let matchedCount = 0;
      const matchedSkillNames: string[] = [];

      requiredSkills.forEach((reqSkill) => {
        const match = candidateSkills.some(
          (cSkill) => cSkill.includes(reqSkill) || reqSkill.includes(cSkill)
        );
        if (match) {
          matchedCount++;
          matchedSkillNames.push(reqSkill);
        }
      });

      const skillRatio = matchedCount / requiredSkills.length;
      score += Math.round(skillRatio * 40); // up to 40 pts

      if (matchedSkillNames.length > 0) {
        highlights.push(
          `${matchedSkillNames.length} tələb olunan açar bacarıq uyğunluğu (${matchedSkillNames.slice(0, 3).join(', ')})`
        );
      }
    }

    // 2. Title & Role relevance
    const candidateTitle = (cv.personalInfo?.jobTitle || '').toLowerCase();
    const vacancyTitle = (vacancy.title || '').toLowerCase();
    if (candidateTitle) {
      const words = vacancyTitle.split(/\s+/).filter((w) => w.length > 3);
      const matchedWords = words.filter((w) => candidateTitle.includes(w));
      if (matchedWords.length > 0) {
        score += 15;
        highlights.push(`Vəzifə profili uyğunluğu: ${cv.personalInfo.jobTitle}`);
      }
    }

    // 3. Experience Depth
    const expCount = (cv.experiences || []).length;
    if (expCount >= 3) {
      score += 10;
      highlights.push('Zəngin iş təcrübəsi portfeli (3+ vəzifə)');
    } else if (expCount >= 1) {
      score += 5;
    }

    // 4. Education & Languages
    if ((cv.education || []).length > 0) {
      score += 5;
    }
  }

  // 5. Cover note bonus
  if (coverNote && coverNote.trim().length > 30) {
    score += 5;
    highlights.push('Ətraflı motivasiya / müraciət məktubu mövcuddur');
  }

  // Cap between 15 and 98
  score = Math.max(15, Math.min(98, score));

  if (highlights.length === 0) {
    highlights.push('İlkin müraciət qeydə alındı');
  }

  return {
    score,
    overallScore: score,
    highlights,
  };
}
