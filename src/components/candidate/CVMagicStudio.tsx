import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Mic,
  Square,
  Keyboard,
  UploadCloud,
  FileText,
  Sparkles,
  Wand2,
  Loader2,
  AlertCircle,
  CheckCircle2,
  X,
  RotateCcw,
  ChevronRight,
  ScanText,
  LayoutTemplate,
  ShieldCheck,
  ArrowUpRight,
} from 'lucide-react';

/**
 * CV Studio — one entry point, three ways to give Jobia your story:
 *   🎙  voice  (Web Speech API live, or MediaRecorder → /api/ai/transcribe-audio fallback)
 *   ⌨️  text   (free text / old CV / LinkedIn)
 *   📄  upload (PDF / DOCX / DOC / TXT / image → /api/ai/extract-cv-text)
 * Every mode fills the same "material" text which is then sent to the existing
 * CV generator via `onGenerate`.
 */

type Mode = 'voice' | 'text' | 'upload';
type Lang = 'az' | 'en' | 'ru' | string;

interface CVMagicStudioProps {
  language: Lang;
  isGenerating: boolean;
  statusMsg?: string;
  errorMsg?: string;
  sampleText: string;
  onGenerate: (text: string) => void | Promise<void>;
  onManualEdit: () => void;
}

const MIN_CHARS = 15;
const MAX_RECORD_SECONDS = 300;
const MAX_UPLOAD_MB = 8;
const BAR_COUNT = 28;

// ───────────── i18n (local, small) ─────────────
const T = {
  az: {
    badge: 'AI CV Studio',
    title: 'Danış, yaz və ya yüklə —',
    titleAccent: 'CV özü hazırlansın',
    subtitle: 'Seçdiyin üsulla karyera hekayəni ver. Jobia AI onu saniyələr içində səliqəli, ATS-ə uyğun CV-yə çevirəcək.',
    modes: {
      voice: { label: 'Səslə', hint: 'Danış, biz yazaq' },
      text: { label: 'Yazı ilə', hint: 'Sərbəst yaz və ya yapışdır' },
      upload: { label: 'Yüklə', hint: 'PDF, Word, şəkil' },
    },
    voiceIdle: 'Mikrofona toxun və özün haqqında danış',
    voiceRec: 'Dinləyirəm… rahat danış',
    voiceTranscribing: 'Səs mətnə çevrilir…',
    voiceStop: 'Dayandır',
    voiceUnsupported: 'Bu brauzer mikrofonu dəstəkləmir. Chrome, Edge və ya Safari-dən istifadə edin.',
    voiceDenied: 'Mikrofona icazə verilmədi. Brauzerin ünvan sətrindəki 🔒 işarəsindən icazə verin.',
    voiceTipTitle: 'Nədən danışım?',
    voicePrompts: [
      'Adın, soyadın və hazırkı vəzifən',
      'Harada, hansı illərdə işləmisən?',
      'Ən böyük nailiyyətin nə olub?',
      'Təhsilin: universitet, ixtisas, illər',
      'Bacarıqların və bildiyin dillər',
      'Telefon, e-poçt və şəhər',
    ],
    textPlaceholder:
      'Özün haqqında sərbəst yaz və ya köhnə CV / LinkedIn mətnini yapışdır.\n\nMəsələn: "Adım Leyla Məmmədovadır. 2019-dan Kapital Bank-da HR mütəxəssisiyəm, 120 nəfərlik işə qəbul prosesini idarə edirəm. UNEC-də menecment oxumuşam. İngilis dili C1, Excel, 1C bilirəm. Tel: 050 123 45 67"',
    textChips: ['Ad və vəzifə', 'İş təcrübəsi', 'Təhsil', 'Bacarıqlar', 'Dillər', 'Əlaqə'],
    sample: 'Nümunə qoy',
    clear: 'Təmizlə',
    dropTitle: 'Faylı bura at və ya seç',
    dropHint: `PDF, DOCX, DOC, TXT və ya CV şəkli · maks. ${MAX_UPLOAD_MB}MB`,
    reading: 'Fayl oxunur…',
    readOk: 'Fayl oxundu — mətn aşağıda, istəsən düzəlt',
    tooBig: `Fayl çox böyükdür (maks. ${MAX_UPLOAD_MB}MB).`,
    badType: 'Bu format dəstəklənmir. PDF, DOCX, TXT və ya şəkil yükləyin.',
    material: 'AI-nin oxuyacağı mətn',
    materialEmpty: 'Hələ boşdur — yuxarıdakı üsullardan birini seç',
    chars: 'simvol',
    needMore: 'Bir az daha məlumat ver (ən azı bir neçə cümlə).',
    generate: 'CV-ni hazırla',
    generating: 'CV hazırlanır…',
    manual: 'Əl ilə doldurmaq istəyirəm →',
    steps: ['Mətn oxunur', 'Təcrübə və təhsil strukturlaşdırılır', 'ATS üçün cilalanır', 'Şablona yerləşdirilir'],
    trust: ['Məlumatlar yalnız CV üçün istifadə olunur', 'Hazır CV-ni sonra redaktə edə bilərsən'],
  },
  en: {
    badge: 'AI CV Studio',
    title: 'Speak, type or upload —',
    titleAccent: 'your CV builds itself',
    subtitle: 'Tell your career story your way. Jobia AI turns it into a clean, ATS-friendly CV in seconds.',
    modes: {
      voice: { label: 'Voice', hint: 'Talk, we type' },
      text: { label: 'Text', hint: 'Write or paste' },
      upload: { label: 'Upload', hint: 'PDF, Word, image' },
    },
    voiceIdle: 'Tap the mic and talk about yourself',
    voiceRec: 'Listening… take your time',
    voiceTranscribing: 'Turning speech into text…',
    voiceStop: 'Stop',
    voiceUnsupported: 'This browser does not support the microphone. Try Chrome, Edge or Safari.',
    voiceDenied: 'Microphone access was denied. Allow it via the 🔒 icon in the address bar.',
    voiceTipTitle: 'What should I say?',
    voicePrompts: [
      'Your name and current role',
      'Where and when have you worked?',
      'Your biggest achievement',
      'Education: university, field, years',
      'Skills and languages',
      'Phone, email and city',
    ],
    textPlaceholder:
      'Write freely about yourself or paste your old CV / LinkedIn text.\n\nExample: "I\'m Leyla Mammadova. HR specialist at Kapital Bank since 2019, running hiring for 120 roles. Studied management at UNEC. English C1, Excel. Tel: 050 123 45 67"',
    textChips: ['Name & role', 'Experience', 'Education', 'Skills', 'Languages', 'Contact'],
    sample: 'Insert sample',
    clear: 'Clear',
    dropTitle: 'Drop your file here or browse',
    dropHint: `PDF, DOCX, DOC, TXT or a CV photo · max ${MAX_UPLOAD_MB}MB`,
    reading: 'Reading file…',
    readOk: 'File read — text is below, edit if you like',
    tooBig: `File is too large (max ${MAX_UPLOAD_MB}MB).`,
    badType: 'Unsupported format. Upload PDF, DOCX, TXT or an image.',
    material: 'Text the AI will read',
    materialEmpty: 'Empty for now — pick a method above',
    chars: 'characters',
    needMore: 'Please give a bit more information (a few sentences).',
    generate: 'Build my CV',
    generating: 'Building your CV…',
    manual: 'I prefer to fill it in manually →',
    steps: ['Reading your text', 'Structuring experience & education', 'Polishing for ATS', 'Placing into template'],
    trust: ['Your data is used only for your CV', 'You can edit the CV afterwards'],
  },
  ru: {
    badge: 'AI CV Studio',
    title: 'Скажите, напишите или загрузите —',
    titleAccent: 'резюме соберётся само',
    subtitle: 'Расскажите о карьере удобным способом. Jobia AI превратит это в аккуратное ATS-резюме за секунды.',
    modes: {
      voice: { label: 'Голосом', hint: 'Говорите — мы запишем' },
      text: { label: 'Текстом', hint: 'Напишите или вставьте' },
      upload: { label: 'Загрузить', hint: 'PDF, Word, фото' },
    },
    voiceIdle: 'Нажмите на микрофон и расскажите о себе',
    voiceRec: 'Слушаю… говорите спокойно',
    voiceTranscribing: 'Преобразуем речь в текст…',
    voiceStop: 'Стоп',
    voiceUnsupported: 'Браузер не поддерживает микрофон. Используйте Chrome, Edge или Safari.',
    voiceDenied: 'Доступ к микрофону запрещён. Разрешите его через 🔒 в адресной строке.',
    voiceTipTitle: 'О чём рассказать?',
    voicePrompts: [
      'Имя и текущая должность',
      'Где и когда вы работали?',
      'Ваше главное достижение',
      'Образование: вуз, специальность, годы',
      'Навыки и языки',
      'Телефон, e-mail и город',
    ],
    textPlaceholder:
      'Напишите о себе свободно или вставьте текст старого резюме / LinkedIn.\n\nНапример: «Я Лейла Мамедова. С 2019 года HR-специалист в Kapital Bank, веду подбор на 120 позиций. Окончила UNEC по менеджменту. Английский C1, Excel. Тел: 050 123 45 67»',
    textChips: ['Имя и должность', 'Опыт', 'Образование', 'Навыки', 'Языки', 'Контакты'],
    sample: 'Вставить пример',
    clear: 'Очистить',
    dropTitle: 'Перетащите файл сюда или выберите',
    dropHint: `PDF, DOCX, DOC, TXT или фото резюме · макс. ${MAX_UPLOAD_MB}МБ`,
    reading: 'Читаем файл…',
    readOk: 'Файл прочитан — текст ниже, можно поправить',
    tooBig: `Файл слишком большой (макс. ${MAX_UPLOAD_MB}МБ).`,
    badType: 'Формат не поддерживается. Загрузите PDF, DOCX, TXT или изображение.',
    material: 'Текст, который прочитает ИИ',
    materialEmpty: 'Пока пусто — выберите способ выше',
    chars: 'символов',
    needMore: 'Добавьте ещё немного информации (несколько предложений).',
    generate: 'Создать резюме',
    generating: 'Создаём резюме…',
    manual: 'Хочу заполнить вручную →',
    steps: ['Читаем текст', 'Структурируем опыт и образование', 'Шлифуем под ATS', 'Размещаем в шаблоне'],
    trust: ['Данные используются только для резюме', 'Резюме можно отредактировать потом'],
  },
};

const SPEECH_LANG: Record<string, string> = { az: 'az-AZ', en: 'en-US', ru: 'ru-RU', tr: 'tr-TR' };

const ACCEPTED_EXT = ['.pdf', '.docx', '.doc', '.txt', '.rtf', '.png', '.jpg', '.jpeg', '.webp'];

const fileToBase64 = (file: Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });

const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

export const CVMagicStudio: React.FC<CVMagicStudioProps> = ({
  language,
  isGenerating,
  statusMsg,
  errorMsg,
  sampleText,
  onGenerate,
  onManualEdit,
}) => {
  const t = (T as any)[language] || T.az;

  const [mode, setMode] = useState<Mode>('voice');
  const [material, setMaterial] = useState('');
  const [localError, setLocalError] = useState('');
  const [localInfo, setLocalInfo] = useState('');

  // Voice state
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [interim, setInterim] = useState('');
  const [seconds, setSeconds] = useState(0);
  const [promptIdx, setPromptIdx] = useState(0);

  // Upload state
  const [isDragging, setIsDragging] = useState(false);
  const [isReadingFile, setIsReadingFile] = useState(false);
  const [uploadedName, setUploadedName] = useState('');

  // Generation loader step
  const [genStep, setGenStep] = useState(0);

  const recognitionRef = useRef<any>(null);
  const keepListeningRef = useRef(false);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const rafRef = useRef<number | null>(null);
  const barsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const timerRef = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const SpeechRecognitionCtor: any =
    typeof window !== 'undefined' ? (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition : null;

  const appendMaterial = useCallback((chunk: string) => {
    const clean = chunk.trim();
    if (!clean) return;
    setMaterial((prev) => (prev.trim() ? `${prev.trim()}\n${clean}` : clean));
  }, []);

  // ───────────── waveform ─────────────
  const startVisualizer = (stream: MediaStream) => {
    try {
      const Ctx = (window as any).AudioContext || (window as any).webkitAudioContext;
      if (!Ctx) return;
      const ctx: AudioContext = new Ctx();
      audioCtxRef.current = ctx;
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 128;
      ctx.createMediaStreamSource(stream).connect(analyser);
      const data = new Uint8Array(analyser.frequencyBinCount);
      const loop = () => {
        analyser.getByteFrequencyData(data);
        for (let i = 0; i < BAR_COUNT; i++) {
          const el = barsRef.current[i];
          if (!el) continue;
          const v = data[Math.floor((i / BAR_COUNT) * data.length * 0.8)] / 255;
          el.style.transform = `scaleY(${Math.max(0.12, v * 1.15)})`;
        }
        rafRef.current = requestAnimationFrame(loop);
      };
      loop();
    } catch {
      /* visualizer is decorative only */
    }
  };

  const stopVisualizer = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    audioCtxRef.current?.close().catch(() => {});
    audioCtxRef.current = null;
    barsRef.current.forEach((el) => el && (el.style.transform = 'scaleY(0.12)'));
  };

  const releaseStream = () => {
    mediaStreamRef.current?.getTracks().forEach((tr) => tr.stop());
    mediaStreamRef.current = null;
  };

  const stopTimer = () => {
    if (timerRef.current) window.clearInterval(timerRef.current);
    timerRef.current = null;
  };

  // ───────────── recording ─────────────
  const transcribeBlob = async (blob: Blob, mimeType: string) => {
    setIsTranscribing(true);
    try {
      const audioBase64 = await fileToBase64(blob);
      const res = await fetch('/api/ai/transcribe-audio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ audioBase64, mimeType, language }),
      });
      const data = await res.json().catch(() => ({}));
      if (data?.success && data.text) {
        appendMaterial(data.text);
      } else {
        setLocalError(data?.error || t.voiceUnsupported);
      }
    } catch {
      setLocalError(t.voiceUnsupported);
    } finally {
      setIsTranscribing(false);
    }
  };

  const stopRecording = useCallback(() => {
    keepListeningRef.current = false;
    setIsRecording(false);
    setInterim('');
    stopTimer();
    stopVisualizer();
    try {
      recognitionRef.current?.stop();
    } catch {
      /* noop */
    }
    recognitionRef.current = null;
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop(); // onstop releases the stream + transcribes
    } else {
      releaseStream();
    }
  }, []);

  const startRecording = async () => {
    setLocalError('');
    setLocalInfo('');
    if (!navigator.mediaDevices?.getUserMedia) {
      setLocalError(t.voiceUnsupported);
      return;
    }

    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      setLocalError(t.voiceDenied);
      return;
    }
    mediaStreamRef.current = stream;
    startVisualizer(stream);

    if (SpeechRecognitionCtor) {
      // Live, on-device / browser transcription — free and instant.
      const rec = new SpeechRecognitionCtor();
      rec.lang = SPEECH_LANG[language] || 'az-AZ';
      rec.continuous = true;
      rec.interimResults = true;
      rec.onresult = (e: any) => {
        let live = '';
        for (let i = e.resultIndex; i < e.results.length; i++) {
          const r = e.results[i];
          if (r.isFinal) appendMaterial(r[0].transcript);
          else live += r[0].transcript;
        }
        setInterim(live);
      };
      rec.onerror = (e: any) => {
        if (e?.error === 'not-allowed' || e?.error === 'service-not-allowed') {
          setLocalError(t.voiceDenied);
          stopRecording();
        }
      };
      // Chrome ends the session after a silence — restart while the user is still "recording".
      rec.onend = () => {
        if (keepListeningRef.current) {
          try {
            rec.start();
          } catch {
            /* already started */
          }
        }
      };
      recognitionRef.current = rec;
      keepListeningRef.current = true;
      try {
        rec.start();
      } catch {
        /* noop */
      }
    } else if (typeof MediaRecorder !== 'undefined') {
      // Fallback: record, then transcribe on the server with AI.
      const preferred = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg'];
      const mimeType = preferred.find((m) => (MediaRecorder as any).isTypeSupported?.(m)) || '';
      const mr = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
      audioChunksRef.current = [];
      mr.ondataavailable = (e) => e.data.size > 0 && audioChunksRef.current.push(e.data);
      mr.onstop = () => {
        const type = mr.mimeType || mimeType || 'audio/webm';
        const blob = new Blob(audioChunksRef.current, { type });
        releaseStream();
        mediaRecorderRef.current = null;
        if (blob.size > 2000) transcribeBlob(blob, type);
      };
      mediaRecorderRef.current = mr;
      mr.start(1000);
    } else {
      releaseStream();
      stopVisualizer();
      setLocalError(t.voiceUnsupported);
      return;
    }

    setSeconds(0);
    setIsRecording(true);
    timerRef.current = window.setInterval(() => setSeconds((s) => s + 1), 1000);
  };

  // auto-stop at limit
  useEffect(() => {
    if (isRecording && seconds >= MAX_RECORD_SECONDS) stopRecording();
  }, [seconds, isRecording, stopRecording]);

  // rotate guidance prompts while recording
  useEffect(() => {
    if (!isRecording) return;
    const id = window.setInterval(() => setPromptIdx((i) => (i + 1) % t.voicePrompts.length), 7000);
    return () => window.clearInterval(id);
  }, [isRecording, t.voicePrompts.length]);

  // cleanup on unmount
  useEffect(
    () => () => {
      keepListeningRef.current = false;
      try {
        recognitionRef.current?.stop();
      } catch {
        /* noop */
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.onstop = null;
        mediaRecorderRef.current.stop();
      }
      stopTimer();
      stopVisualizer();
      releaseStream();
    },
    []
  );

  // switching away from voice stops the mic
  useEffect(() => {
    if (mode !== 'voice' && isRecording) stopRecording();
  }, [mode, isRecording, stopRecording]);

  // ───────────── upload ─────────────
  const handleFile = async (file?: File | null) => {
    if (!file) return;
    setLocalError('');
    setLocalInfo('');
    const lower = file.name.toLowerCase();
    if (!ACCEPTED_EXT.some((ext) => lower.endsWith(ext)) && !file.type.startsWith('image/')) {
      setLocalError(t.badType);
      return;
    }
    if (file.size > MAX_UPLOAD_MB * 1024 * 1024) {
      setLocalError(t.tooBig);
      return;
    }

    setUploadedName(file.name);
    setIsReadingFile(true);
    try {
      if (lower.endsWith('.txt')) {
        const txt = await file.text();
        setMaterial(txt.trim());
        setLocalInfo(t.readOk);
        return;
      }
      const fileBase64 = await fileToBase64(file);
      const res = await fetch('/api/ai/extract-cv-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileBase64, mimeType: file.type, fileName: file.name }),
      });
      const data = await res.json().catch(() => ({}));
      if (data?.success && data.text) {
        setMaterial(String(data.text).trim());
        setLocalInfo(t.readOk);
      } else {
        setLocalError(data?.error || t.badType);
        setUploadedName('');
      }
    } catch {
      setLocalError(t.badType);
      setUploadedName('');
    } finally {
      setIsReadingFile(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // ───────────── generate ─────────────
  useEffect(() => {
    if (!isGenerating) {
      setGenStep(0);
      return;
    }
    const id = window.setInterval(() => setGenStep((s) => Math.min(s + 1, t.steps.length - 1)), 1800);
    return () => window.clearInterval(id);
  }, [isGenerating, t.steps.length]);

  const handleGenerate = () => {
    if (isRecording) stopRecording();
    const text = `${material}\n${interim}`.trim();
    if (text.length < MIN_CHARS) {
      setLocalError(t.needMore);
      return;
    }
    setLocalError('');
    onGenerate(text);
  };

  const insertChip = (chip: string) => {
    const prefix = material && !material.endsWith('\n') ? '\n' : '';
    setMaterial((m) => `${m}${prefix}${chip}: `);
    requestAnimationFrame(() => textareaRef.current?.focus());
  };

  const charCount = (material + interim).trim().length;
  const shownError = localError || errorMsg;
  const busy = isGenerating || isTranscribing || isReadingFile;

  // jobia.az brand: green #00a859 (hover #00914c, active #007a40, light #ecfdf5, border #a7f3d0),
  // white surfaces, soft green canvas, deep-green feature panel (same as homepage hero card).
  const modeTiles: { id: Mode; icon: React.ReactNode }[] = [
    { id: 'voice', icon: <Mic className="w-5 h-5" /> },
    { id: 'text', icon: <Keyboard className="w-5 h-5" /> },
    { id: 'upload', icon: <UploadCloud className="w-5 h-5" /> },
  ];

  return (
    <section className="cv-studio relative overflow-hidden rounded-[28px] border border-[#dce9df] bg-white text-slate-900 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_12px_40px_-12px_rgba(0,122,64,0.12)]">
      {/* soft brand canvas */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="cv-studio-blob absolute -top-32 -right-24 h-80 w-80 rounded-full bg-[#00a859]/10 blur-3xl" />
        <div className="cv-studio-blob cv-studio-blob-delay absolute -bottom-32 -left-24 h-72 w-72 rounded-full bg-[#9ce8bb]/25 blur-3xl" />
      </div>

      <div className="relative p-5 sm:p-7 space-y-6">
        {/* Header */}
        <div className="space-y-3">
          <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[#007a40]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#00a859]" /> {t.badge}
          </span>
          <h2 className="cv-studio-heading text-2xl sm:text-[32px] font-extrabold leading-[1.1] tracking-tight text-[#0f172a]">
            {t.title} <span className="text-[#00a859]">{t.titleAccent}</span>
          </h2>
          <p className="text-sm sm:text-[15px] text-slate-500 max-w-xl leading-relaxed">{t.subtitle}</p>
        </div>

        {/* Mode switcher */}
        <div role="tablist" className="grid grid-cols-3 gap-2 sm:gap-3">
          {modeTiles.map((m) => {
            const active = mode === m.id;
            const meta = t.modes[m.id];
            return (
              <button
                key={m.id}
                role="tab"
                aria-selected={active}
                type="button"
                onClick={() => {
                  setMode(m.id);
                  setLocalError('');
                }}
                className={`group relative rounded-2xl border p-3 sm:p-4 text-left transition-all cursor-pointer ${
                  active
                    ? 'border-[#00a859] bg-[#ecfdf5] shadow-[0_6px_20px_-8px_rgba(0,168,89,0.45)]'
                    : 'border-[#e3ece6] bg-white hover:border-[#a7f3d0] hover:bg-[#f6fbf8]'
                }`}
              >
                <span
                  className={`mb-2 inline-flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl transition-all ${
                    active ? 'bg-[#00a859] text-white' : 'bg-[#ecfdf5] text-[#007a40] group-hover:bg-[#dcfce7]'
                  }`}
                >
                  {m.icon}
                </span>
                <span className={`block text-sm sm:text-base font-bold ${active ? 'text-[#065f46]' : 'text-slate-800'}`}>
                  {meta.label}
                </span>
                <span className="hidden sm:block text-[11px] text-slate-500">{meta.hint}</span>
                {active && (
                  <span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-[#00a859] ring-4 ring-[#00a859]/15" />
                )}
              </button>
            );
          })}
        </div>

        {/* Mode panel */}
        {mode === 'voice' && (
          <div className="cv-studio-hero relative overflow-hidden rounded-3xl bg-[#0b2a1c] p-5 sm:p-6 text-white">
            <div aria-hidden className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(156,232,187,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(156,232,187,0.07)_1px,transparent_1px)] [background-size:28px_28px]" />
            <div aria-hidden className="pointer-events-none absolute -top-20 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-[#00a859]/30 blur-3xl" />
            <div className="relative flex flex-col items-center text-center gap-4">
              <div className="relative">
                <span className="absolute -inset-5 rounded-full border border-dashed border-[#9ce8bb]/30" />
                {isRecording && (
                  <>
                    <span className="absolute inset-0 rounded-full bg-[#00a859]/50 animate-ping" />
                    <span className="absolute -inset-2 rounded-full ring-2 ring-[#9ce8bb]/40 animate-pulse" />
                  </>
                )}
                <button
                  type="button"
                  onClick={isRecording ? stopRecording : startRecording}
                  disabled={isTranscribing || isGenerating}
                  aria-label={isRecording ? t.voiceStop : t.voiceIdle}
                  className={`relative flex h-24 w-24 items-center justify-center rounded-full shadow-[0_10px_40px_-6px_rgba(0,168,89,0.7)] transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed active:scale-95 ${
                    isRecording ? 'bg-rose-500' : 'bg-[#00a859] hover:bg-[#00914c] hover:scale-105'
                  }`}
                >
                  {isTranscribing ? (
                    <Loader2 className="w-9 h-9 animate-spin" />
                  ) : isRecording ? (
                    <Square className="w-8 h-8 fill-white" />
                  ) : (
                    <Mic className="w-10 h-10" />
                  )}
                </button>
              </div>

              {/* waveform */}
              <div className="mt-2 flex h-10 items-center justify-center gap-[3px]" aria-hidden>
                {Array.from({ length: BAR_COUNT }).map((_, i) => (
                  <span
                    key={i}
                    ref={(el) => {
                      barsRef.current[i] = el;
                    }}
                    className="block h-full w-[3px] origin-center rounded-full bg-[#9ce8bb] transition-transform duration-75"
                    style={{ transform: 'scaleY(0.12)' }}
                  />
                ))}
              </div>

              <div className="space-y-1">
                <p className="text-sm font-semibold">
                  {isTranscribing ? t.voiceTranscribing : isRecording ? t.voiceRec : t.voiceIdle}
                </p>
                {isRecording && (
                  <p className="text-xs font-mono text-[#9ce8bb]">
                    ● {formatTime(seconds)} / {formatTime(MAX_RECORD_SECONDS)}
                  </p>
                )}
              </div>

              {/* guidance */}
              <div className="w-full">
                <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#9ce8bb]/80">{t.voiceTipTitle}</p>
                <div className="flex flex-wrap justify-center gap-1.5">
                  {t.voicePrompts.map((p: string, i: number) => (
                    <span
                      key={p}
                      className={`rounded-full border px-2.5 py-1 text-[11px] transition-all ${
                        isRecording && i === promptIdx
                          ? 'border-[#9ce8bb] bg-[#00a859]/30 text-white scale-105'
                          : 'border-white/10 bg-white/5 text-[#c9eed8]'
                      }`}
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>

              {interim && (
                <p className="w-full rounded-2xl bg-white px-3.5 py-2.5 text-left text-sm italic text-slate-700 shadow-lg">
                  {interim}
                  <span className="ml-0.5 inline-block w-1.5 animate-pulse text-[#00a859]">▍</span>
                </p>
              )}
            </div>
          </div>
        )}

        {mode === 'text' && (
          <div className="flex flex-wrap items-center gap-1.5">
            {t.textChips.map((chip: string) => (
              <button
                key={chip}
                type="button"
                onClick={() => insertChip(chip)}
                className="rounded-full border border-[#e3ece6] bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:border-[#a7f3d0] hover:bg-[#ecfdf5] hover:text-[#007a40] transition-colors cursor-pointer"
              >
                + {chip}
              </button>
            ))}
            <button
              type="button"
              onClick={() => {
                setMaterial(sampleText);
                setLocalError('');
              }}
              className="ml-auto inline-flex items-center gap-1 rounded-full bg-[#ecfdf5] border border-[#a7f3d0] px-3 py-1.5 text-xs font-bold text-[#007a40] hover:bg-[#dcfce7] cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" /> {t.sample}
            </button>
          </div>
        )}

        {mode === 'upload' && (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              handleFile(e.dataTransfer.files?.[0]);
            }}
            onClick={() => !isReadingFile && fileInputRef.current?.click()}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && fileInputRef.current?.click()}
            role="button"
            tabIndex={0}
            className={`flex min-h-[210px] flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed p-6 text-center transition-all cursor-pointer ${
              isDragging
                ? 'border-[#00a859] bg-[#ecfdf5] scale-[1.01]'
                : 'border-[#cfe3d6] bg-[#f6fbf8] hover:border-[#00a859] hover:bg-[#ecfdf5]'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept={ACCEPTED_EXT.join(',') + ',image/*'}
              className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0])}
            />
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#00a859] text-white shadow-[0_8px_24px_-8px_rgba(0,168,89,0.7)]">
              {isReadingFile ? <ScanText className="w-7 h-7 animate-pulse" /> : <UploadCloud className="w-7 h-7" />}
            </span>
            <div>
              <p className="text-sm font-bold text-slate-900">{isReadingFile ? t.reading : t.dropTitle}</p>
              <p className="text-xs text-slate-500 mt-0.5">{t.dropHint}</p>
            </div>
            {uploadedName && !isReadingFile && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#a7f3d0] bg-white px-3 py-1 text-xs font-medium text-[#065f46]">
                <FileText className="w-3.5 h-3.5" /> {uploadedName}
              </span>
            )}
          </div>
        )}

        {/* Shared material editor */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-[#00a859]" /> {t.material}
            </span>
            <span className="flex items-center gap-3 text-slate-400">
              <span>
                {charCount} {t.chars}
              </span>
              {material && (
                <button
                  type="button"
                  onClick={() => {
                    setMaterial('');
                    setUploadedName('');
                    setLocalInfo('');
                  }}
                  className="inline-flex items-center gap-1 hover:text-rose-500 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" /> {t.clear}
                </button>
              )}
            </span>
          </div>
          <textarea
            ref={textareaRef}
            value={material}
            onChange={(e) => {
              setMaterial(e.target.value);
              if (localError) setLocalError('');
            }}
            onFocus={() => mode !== 'text' && !material && setMode('text')}
            rows={mode === 'text' ? 9 : 5}
            placeholder={mode === 'text' ? t.textPlaceholder : t.materialEmpty}
            className="w-full resize-y rounded-2xl border border-[#e3ece6] bg-white p-4 text-sm leading-relaxed text-slate-800 placeholder:text-slate-400 transition-shadow focus:outline-none focus:border-[#00a859] focus:ring-4 focus:ring-[#00a859]/10"
          />
        </div>

        {/* Messages */}
        {shownError && (
          <div className="flex items-start gap-2 rounded-2xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="flex-1">{shownError}</span>
            {localError && (
              <button type="button" onClick={() => setLocalError('')} className="cursor-pointer" aria-label="close">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
        {!shownError && (statusMsg || localInfo) && (
          <div className="flex items-center gap-2 rounded-2xl border border-[#a7f3d0] bg-[#ecfdf5] p-3 text-xs text-[#065f46]">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-[#00a859]" />
            <span className="font-semibold">{statusMsg || localInfo}</span>
          </div>
        )}

        {/* Generate */}
        {isGenerating ? (
          <div className="rounded-2xl border border-[#dce9df] bg-[#f6fbf8] p-4">
            <div className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-900">
              <Loader2 className="w-4 h-4 animate-spin text-[#00a859]" /> {t.generating}
            </div>
            <ol className="grid gap-2 sm:grid-cols-4">
              {t.steps.map((s: string, i: number) => (
                <li
                  key={s}
                  className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-[11px] font-medium transition-all ${
                    i < genStep
                      ? 'border-[#a7f3d0] bg-white text-[#065f46]'
                      : i === genStep
                      ? 'border-[#00a859] bg-[#ecfdf5] text-[#007a40]'
                      : 'border-[#e3ece6] bg-white text-slate-400'
                  }`}
                >
                  {i < genStep ? (
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-[#00a859]" />
                  ) : i === genStep ? (
                    <Loader2 className="w-3.5 h-3.5 shrink-0 animate-spin" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 shrink-0" />
                  )}
                  {s}
                </li>
              ))}
            </ol>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#dce9df]">
              <div
                className="h-full rounded-full bg-[#00a859] transition-all duration-700"
                style={{ width: `${((genStep + 1) / t.steps.length) * 100}%` }}
              />
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleGenerate}
            disabled={busy || charCount < MIN_CHARS}
            className="cv-studio-cta group relative w-full overflow-hidden rounded-2xl bg-[#00a859] py-4 text-base font-bold text-white shadow-[0_10px_30px_-10px_rgba(0,168,89,0.8)] transition-all hover:bg-[#00914c] active:bg-[#007a40] active:scale-[0.99] disabled:bg-[#b9dcc7] disabled:shadow-none disabled:cursor-not-allowed cursor-pointer"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              <Wand2 className="w-5 h-5 transition-transform group-hover:rotate-12" />
              {t.generate}
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          </button>
        )}

        {/* Footer */}
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between text-xs text-slate-500">
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#00a859]" /> {t.trust[0]}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <LayoutTemplate className="w-3.5 h-3.5 text-[#00a859]" /> {t.trust[1]}
            </span>
          </div>
          <button
            type="button"
            onClick={onManualEdit}
            className="self-start sm:self-auto font-semibold text-[#007a40] hover:text-[#00a859] cursor-pointer"
          >
            {t.manual}
          </button>
        </div>
      </div>
    </section>
  );
};

export default CVMagicStudio;
