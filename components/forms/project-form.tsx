"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Building2,
  Heart,
  DollarSign,
  FileUp,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Upload,
  X,
  File,
  Loader2,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { cn, formatFileSize, ACCEPTED_FILE_TYPES, MAX_FILE_SIZE } from "@/lib/utils";
import type { ProjectFormData } from "@/types";

// ── Types ────────────────────────────────────────────────────
type FormStep = 1 | 2 | 3 | 4 | 5;

interface FileWithPreview extends File {
  preview?: string;
}

interface StepConfig {
  id: FormStep;
  label: string;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
}

// ── Steps config ─────────────────────────────────────────────
const STEPS: StepConfig[] = [
  { id: 1, label: "Personal", title: "Datos personales", subtitle: "Información de contacto", icon: User },
  { id: 2, label: "Proyecto", title: "Tu proyecto", subtitle: "Información productiva", icon: Building2 },
  { id: 3, label: "Inversión", title: "Inversión y capacidad", subtitle: "Datos financieros básicos", icon: DollarSign },
  { id: 4, label: "Impacto", title: "Impacto social", subtitle: "Beneficiarios y entorno", icon: Heart },
  { id: 5, label: "Documentos", title: "Documentación", subtitle: "Sube tus archivos", icon: FileUp },
];

// ── Initial state ─────────────────────────────────────────────
const INITIAL_DATA: Partial<ProjectFormData> = {
  full_name: "",
  email: "",
  phone: "",
  city: "",
  project_name: "",
  sector: undefined,
  description: "",
  location: "",
  experience_years: 0,
  investment_amount: 0,
  projected_jobs: 0,
  productive_capacity: "",
  social_impact: "",
  beneficiaries: 0,
  environmental_impact: "",
  documents: [],
};

// ── File Dropzone ─────────────────────────────────────────────
function FileDropzone({
  files,
  onFilesChange,
}: {
  files: FileWithPreview[];
  onFilesChange: (files: FileWithPreview[]) => void;
}) {
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [uploadErrors, setUploadErrors] = useState<Record<string, string>>({});

  const onDrop = useCallback(
    (accepted: File[], rejected: any[]) => {
      const validFiles = accepted.filter(
        (f) => f.size <= MAX_FILE_SIZE && !files.find((e) => e.name === f.name)
      );
      const newFiles = validFiles.map((f) =>
        Object.assign(f, { preview: f.type.startsWith("image/") ? URL.createObjectURL(f) : undefined })
      );
      onFilesChange([...files, ...newFiles]);

      // Simulate upload progress for each file
      newFiles.forEach((f) => {
        let pct = 0;
        const interval = setInterval(() => {
          pct += Math.random() * 20 + 5;
          if (pct >= 100) {
            pct = 100;
            clearInterval(interval);
          }
          setUploadProgress((prev) => ({ ...prev, [f.name]: Math.min(pct, 100) }));
        }, 200);
      });

      // Rejected file errors
      const errors: Record<string, string> = {};
      rejected.forEach(({ file, errors: errs }) => {
        if (errs[0]?.code === "file-too-large") {
          errors[file.name] = "Excede 10MB";
        } else {
          errors[file.name] = "Tipo no permitido";
        }
      });
      setUploadErrors(errors);
    },
    [files, onFilesChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_FILE_TYPES,
    maxSize: MAX_FILE_SIZE,
    multiple: true,
  });

  const removeFile = (fileName: string) => {
    onFilesChange(files.filter((f) => f.name !== fileName));
    setUploadProgress((p) => { const n = { ...p }; delete n[fileName]; return n; });
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200",
          isDragActive
            ? "border-brand-DEFAULT bg-brand-light scale-[1.01]"
            : "border-slate-200 bg-slate-50 hover:border-brand-DEFAULT hover:bg-brand-light/50"
        )}
      >
        <input {...getInputProps()} />
        <div className="w-12 h-12 rounded-2xl bg-brand-light flex items-center justify-center mx-auto mb-4">
          <Upload className="h-6 w-6 text-brand-DEFAULT" />
        </div>
        {isDragActive ? (
          <p className="text-brand-DEFAULT font-semibold">Suelta los archivos aquí</p>
        ) : (
          <>
            <p className="text-sm font-semibold text-slate-700 mb-1">
              Arrastra archivos o haz clic para seleccionar
            </p>
            <p className="text-xs text-slate-400">
              PDF, JPG, PNG, WebP · Máximo 10MB por archivo
            </p>
          </>
        )}
      </div>

      {/* Rejected errors */}
      {Object.entries(uploadErrors).map(([name, msg]) => (
        <div key={name} className="flex items-center gap-2 text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">{name}</span>: {msg}
        </div>
      ))}

      {/* File list */}
      {files.length > 0 && (
        <div className="space-y-2.5">
          {files.map((file) => {
            const pct = uploadProgress[file.name] || 0;
            const done = pct >= 100;
            return (
              <div key={file.name} className="bg-white border border-slate-100 rounded-xl p-3 flex items-center gap-3">
                {file.preview ? (
                  <img src={file.preview} alt={file.name} className="w-10 h-10 rounded-lg object-cover shrink-0" />
                ) : (
                  <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                    <File className="h-5 w-5 text-slate-400" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-700 truncate">{file.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Progress value={pct} className="flex-1 h-1" />
                    <span className="text-[10px] text-slate-400 w-8 text-right">
                      {done ? formatFileSize(file.size) : `${Math.round(pct)}%`}
                    </span>
                  </div>
                </div>
                {done ? (
                  <CheckCircle2 className="h-4 w-4 text-brand-DEFAULT shrink-0" />
                ) : (
                  <Loader2 className="h-4 w-4 text-slate-300 shrink-0 animate-spin" />
                )}
                <button
                  onClick={() => removeFile(file.name)}
                  className="text-slate-300 hover:text-red-400 transition-colors shrink-0 ml-1"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Step Indicator ────────────────────────────────────────────
function StepIndicator({ current, total }: { current: FormStep; total: number }) {
  return (
    <div className="flex items-center gap-0 mb-8">
      {STEPS.map((step, i) => {
        const isCompleted = step.id < current;
        const isActive = step.id === current;
        const isLast = i === STEPS.length - 1;
        return (
          <div key={step.id} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300",
                  isCompleted && "bg-brand-DEFAULT text-white shadow-sm",
                  isActive && "bg-brand-DEFAULT/15 border-2 border-brand-DEFAULT text-brand-DEFAULT",
                  !isCompleted && !isActive && "bg-slate-100 text-slate-400"
                )}
              >
                {isCompleted ? <CheckCircle2 className="h-4 w-4" /> : step.id}
              </div>
              <span
                className={cn(
                  "text-[10px] font-medium mt-1 whitespace-nowrap hidden sm:block",
                  isActive ? "text-brand-DEFAULT" : isCompleted ? "text-slate-600" : "text-slate-400"
                )}
              >
                {step.label}
              </span>
            </div>
            {!isLast && (
              <div
                className={cn(
                  "flex-1 h-px mx-1.5 transition-all duration-500",
                  step.id < current ? "bg-brand-DEFAULT" : "bg-slate-100"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Field Groups ─────────────────────────────────────────────
function FormField({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label>
        {label}
        {required && <span className="text-red-400 ml-0.5">*</span>}
      </Label>
      {children}
    </div>
  );
}

// ── Main Form ─────────────────────────────────────────────────
export default function ProjectForm() {
  const [step, setStep] = useState<FormStep>(1);
  const [data, setData] = useState<Partial<ProjectFormData>>(INITIAL_DATA);
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [errors, setErrors] = useState<Partial<Record<keyof ProjectFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const updateField = (field: keyof ProjectFormData, value: unknown) => {
    setData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validateStep = (): boolean => {
    const newErrors: Partial<Record<keyof ProjectFormData, string>> = {};
    if (step === 1) {
      if (!data.full_name?.trim()) newErrors.full_name = "Nombre requerido";
      if (!data.email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) newErrors.email = "Email inválido";
      if (!data.phone?.trim()) newErrors.phone = "Teléfono requerido";
      if (!data.city?.trim()) newErrors.city = "Ciudad requerida";
    }
    if (step === 2) {
      if (!data.project_name?.trim()) newErrors.project_name = "Nombre del proyecto requerido";
      if (!data.sector) newErrors.sector = "Selecciona un sector";
      if (!data.description?.trim()) newErrors.description = "Descripción requerida";
    }
    if (step === 3) {
      if (!data.investment_amount || data.investment_amount <= 0) newErrors.investment_amount = "Ingresa el monto de inversión";
      if (!data.projected_jobs || data.projected_jobs <= 0) newErrors.projected_jobs = "Ingresa los empleos proyectados";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep()) setStep((s) => Math.min(s + 1, 5) as FormStep);
  };

  const prevStep = () => setStep((s) => Math.max(s - 1, 1) as FormStep);

  const handleSubmit = async () => {
    if (!validateStep()) return;
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const formData = new FormData();

      // Upload files first
      const uploadedPaths: string[] = [];
      for (const file of files) {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        if (res.ok) {
          const json = await res.json();
          uploadedPaths.push(json.storage_path);
        }
      }

      // Submit project
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: data.full_name,
          email: data.email,
          phone: data.phone,
          city: data.city,
          project_name: data.project_name,
          description: data.description,
          sector: data.sector,
          location: data.location,
          investment_amount: data.investment_amount,
          projected_jobs: data.projected_jobs,
          productive_capacity: data.productive_capacity,
          social_impact: data.social_impact,
          beneficiaries: data.beneficiaries,
          environmental_impact: data.environmental_impact,
          experience_years: data.experience_years,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || "Error al enviar el formulario.");
      }

      setIsSuccess(true);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Error inesperado. Intenta de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const progressPct = ((step - 1) / (STEPS.length - 1)) * 100;
  const currentStepConfig = STEPS[step - 1];

  // ── Success screen ─────────────────────────────────────────
  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12 px-6"
      >
        <div className="w-16 h-16 rounded-2xl bg-brand-light flex items-center justify-center mx-auto mb-5">
          <CheckCircle2 className="h-8 w-8 text-brand-DEFAULT" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">¡Proyecto registrado!</h3>
        <p className="text-slate-500 text-sm max-w-sm mx-auto mb-6">
          Hemos recibido la información de tu proyecto. Nuestro equipo se comunicará contigo en las próximas 24 horas hábiles.
        </p>
        <Button onClick={() => { setIsSuccess(false); setStep(1); setData(INITIAL_DATA); setFiles([]); }}>
          Registrar otro proyecto
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-card-premium overflow-hidden">
      {/* Header */}
      <div className="px-8 pt-8 pb-6 border-b border-slate-50">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="h-4 w-4 text-brand-DEFAULT" />
          <p className="text-xs font-semibold text-brand-DEFAULT uppercase tracking-wider">Formulario de registro</p>
        </div>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-xl font-bold text-slate-900">{currentStepConfig.title}</h3>
            <p className="text-sm text-slate-500 mt-0.5">{currentStepConfig.subtitle}</p>
          </div>
          <Badge variant="secondary" className="text-xs">
            {step} de {STEPS.length}
          </Badge>
        </div>
        <Progress value={progressPct} className="h-1.5" />
        <div className="mt-5">
          <StepIndicator current={step} total={STEPS.length} />
        </div>
      </div>

      {/* Form body */}
      <div className="px-8 py-7">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            {/* ── Step 1: Personal ─────────────────────────── */}
            {step === 1 && (
              <div className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <FormField label="Nombre completo" required>
                    <Input
                      value={data.full_name || ""}
                      onChange={(e) => updateField("full_name", e.target.value)}
                      placeholder="Ej: Carlos Herrera Rodríguez"
                      error={errors.full_name}
                    />
                  </FormField>
                  <FormField label="Correo electrónico" required>
                    <Input
                      type="email"
                      value={data.email || ""}
                      onChange={(e) => updateField("email", e.target.value)}
                      placeholder="correo@ejemplo.com"
                      error={errors.email}
                    />
                  </FormField>
                </div>
                <div className="grid sm:grid-cols-2 gap-5">
                  <FormField label="Teléfono / WhatsApp" required>
                    <Input
                      type="tel"
                      value={data.phone || ""}
                      onChange={(e) => updateField("phone", e.target.value)}
                      placeholder="+57 300 000 0000"
                      error={errors.phone}
                    />
                  </FormField>
                  <FormField label="Ciudad" required>
                    <Input
                      value={data.city || ""}
                      onChange={(e) => updateField("city", e.target.value)}
                      placeholder="Ej: Bogotá, Medellín, Villavicencio"
                      error={errors.city}
                    />
                  </FormField>
                </div>
                <FormField label="Número de identificación (opcional)">
                  <Input
                    value={data.id_number || ""}
                    onChange={(e) => updateField("id_number", e.target.value)}
                    placeholder="Cédula o NIT"
                  />
                </FormField>
              </div>
            )}

            {/* ── Step 2: Project ───────────────────────────── */}
            {step === 2 && (
              <div className="space-y-5">
                <FormField label="Nombre del proyecto" required>
                  <Input
                    value={data.project_name || ""}
                    onChange={(e) => updateField("project_name", e.target.value)}
                    placeholder="Ej: Granja Avícola Las Palmas"
                    error={errors.project_name}
                  />
                </FormField>
                <div className="grid sm:grid-cols-2 gap-5">
                  <FormField label="Sector productivo" required>
                    <Select
                      value={data.sector || ""}
                      onChange={(e) => updateField("sector", e.target.value)}
                      placeholder="Selecciona un sector"
                      error={errors.sector}
                    >
                      <option value="avicola">Avícola</option>
                      <option value="piscicultura">Piscicultura</option>
                      <option value="porcicultura">Porcicultura</option>
                      <option value="economia_circular">Economía Circular</option>
                      <option value="agroindustria">Agroindustria</option>
                      <option value="turismo_rural">Turismo Rural</option>
                      <option value="transformacion_productiva">Transformación Productiva</option>
                      <option value="otro">Otro</option>
                    </Select>
                  </FormField>
                  <FormField label="Departamento / Municipio">
                    <Input
                      value={data.location || ""}
                      onChange={(e) => updateField("location", e.target.value)}
                      placeholder="Ej: Cundinamarca - Fusagasugá"
                    />
                  </FormField>
                </div>
                <FormField label="Descripción del proyecto" required>
                  <Textarea
                    value={data.description || ""}
                    onChange={(e) => updateField("description", e.target.value)}
                    placeholder="Describe tu proyecto en tus propias palabras. ¿Qué vas a producir? ¿Cuál es tu capacidad? ¿Tienes experiencia previa?"
                    rows={4}
                    error={errors.description}
                  />
                </FormField>
                <FormField label="Años de experiencia en el sector">
                  <Input
                    type="number"
                    min={0}
                    max={50}
                    value={data.experience_years || ""}
                    onChange={(e) => updateField("experience_years", parseInt(e.target.value) || 0)}
                    placeholder="0"
                  />
                </FormField>
              </div>
            )}

            {/* ── Step 3: Investment ────────────────────────── */}
            {step === 3 && (
              <div className="space-y-5">
                <div className="p-4 bg-brand-light rounded-xl border border-brand-200">
                  <p className="text-sm text-brand-dark font-medium">
                    💡 Estos datos son estimados. No es necesario tener cifras exactas en este momento.
                  </p>
                </div>
                <div className="grid sm:grid-cols-2 gap-5">
                  <FormField label="Inversión estimada (COP)" required>
                    <Input
                      type="number"
                      min={0}
                      value={data.investment_amount || ""}
                      onChange={(e) => updateField("investment_amount", parseFloat(e.target.value) || 0)}
                      placeholder="Ej: 450000000"
                      error={errors.investment_amount}
                    />
                  </FormField>
                  <FormField label="Empleos proyectados" required>
                    <Input
                      type="number"
                      min={1}
                      value={data.projected_jobs || ""}
                      onChange={(e) => updateField("projected_jobs", parseInt(e.target.value) || 0)}
                      placeholder="Ej: 5"
                      error={errors.projected_jobs}
                    />
                  </FormField>
                </div>
                <FormField label="Capacidad productiva estimada">
                  <Textarea
                    value={data.productive_capacity || ""}
                    onChange={(e) => updateField("productive_capacity", e.target.value)}
                    placeholder="Ej: 10.000 pollos por ciclo de 42 días, 3 ciclos al año. Total: 30.000 pollos anuales."
                    rows={3}
                  />
                </FormField>
              </div>
            )}

            {/* ── Step 4: Social impact ─────────────────────── */}
            {step === 4 && (
              <div className="space-y-5">
                <FormField label="Impacto social del proyecto">
                  <Textarea
                    value={data.social_impact || ""}
                    onChange={(e) => updateField("social_impact", e.target.value)}
                    placeholder="Describe el impacto en la comunidad local: empleos directos e indirectos, fortalecimiento de la economía regional, comunidades beneficiadas..."
                    rows={4}
                  />
                </FormField>
                <FormField label="Número de beneficiarios directos e indirectos">
                  <Input
                    type="number"
                    min={0}
                    value={data.beneficiaries || ""}
                    onChange={(e) => updateField("beneficiaries", parseInt(e.target.value) || 0)}
                    placeholder="Ej: 25"
                  />
                </FormField>
                <FormField label="Impacto ambiental y sostenibilidad">
                  <Textarea
                    value={data.environmental_impact || ""}
                    onChange={(e) => updateField("environmental_impact", e.target.value)}
                    placeholder="Describe prácticas sostenibles, manejo de residuos, uso eficiente del agua, energías renovables, o certificaciones ambientales previstas..."
                    rows={3}
                  />
                </FormField>
              </div>
            )}

            {/* ── Step 5: Documents ─────────────────────────── */}
            {step === 5 && (
              <div className="space-y-5">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-sm font-semibold text-slate-700 mb-2">Documentos sugeridos:</p>
                  <div className="grid sm:grid-cols-2 gap-1.5">
                    {[
                      "RUT (persona natural o jurídica)",
                      "Cámara de Comercio (si aplica)",
                      "Cédula del representante",
                      "Certificado predial o contrato de arriendo",
                      "Cotizaciones o presupuestos",
                      "Fotos del predio o instalaciones",
                    ].map((doc) => (
                      <div key={doc} className="flex items-center gap-1.5 text-xs text-slate-500">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-DEFAULT/60" />
                        {doc}
                      </div>
                    ))}
                  </div>
                </div>
                <FileDropzone files={files} onFilesChange={setFiles} />
                {files.length === 0 && (
                  <p className="text-xs text-center text-slate-400">
                    Los documentos son opcionales. Puedes subirlos más tarde desde el dashboard.
                  </p>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Submit error */}
        {submitError && (
          <div className="mt-4 flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {submitError}
          </div>
        )}
      </div>

      {/* Footer navigation */}
      <div className="px-8 pb-8 flex items-center justify-between gap-3">
        <Button
          onClick={prevStep}
          variant="ghost"
          disabled={step === 1}
          className="gap-1.5"
        >
          <ChevronLeft className="h-4 w-4" />
          Anterior
        </Button>
        <div className="flex-1 flex justify-end">
          {step < 5 ? (
            <Button onClick={nextStep} className="gap-1.5">
              Siguiente
              <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              loading={isSubmitting}
              className="gap-1.5 min-w-[160px]"
            >
              <CheckCircle2 className="h-4 w-4" />
              Enviar Proyecto
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
