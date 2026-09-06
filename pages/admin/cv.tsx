import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Layout from "@/components/Layout";
import UseAuthRedirect from "@/lib/UseAuthRedirect";
import { useFlashMessage } from "@/lib/useFlashMessage";
import { inter } from "@/lib/fonts";
import {
  cardClasses,
  inputClasses,
  primaryButtonClasses,
  secondaryButtonClasses,
} from "@/components/admin/adminStyles";

interface CvVersion {
  filename: string;
  uploaded_at: string;
  size: number;
  content_type: "application/pdf";
  download_url: string;
  phone_number_confirmed_absent: boolean;
  is_current?: boolean;
}

const CV_MAX_SIZE_BYTES = 5 * 1024 * 1024;

const formatSize = (bytes: number) => `${(bytes / 1024 / 1024).toFixed(2)} MB`;
const cvDownloadHref = (version: CvVersion) => (
  `${process.env.NEXT_PUBLIC_API_BROWSER || ""}${version.download_url}`
);

export default function AdminCv() {
  const isCheckingAuth = UseAuthRedirect();
  const { pushMessage } = useFlashMessage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [versions, setVersions] = useState<CvVersion[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [confirmedNoPhone, setConfirmedNoPhone] = useState(false);
  const [error, setError] = useState("");

  const currentVersion = versions.find(version => version.is_current);

  const fetchVersions = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    setLoading(true);
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BROWSER}/api/admin/cv/versions`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      setVersions(await res.json());
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!isCheckingAuth) {
      fetchVersions();
    }
  }, [isCheckingAuth]);

  const validateFile = (file: File) => {
    if (file.type !== "application/pdf" || !file.name.toLowerCase().endsWith(".pdf")) {
      throw new Error("Choose a PDF file.");
    }
    if (file.size <= 0 || file.size > CV_MAX_SIZE_BYTES) {
      throw new Error(`Choose a PDF smaller than ${formatSize(CV_MAX_SIZE_BYTES)}.`);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setError("");
    setSelectedFile(null);
    if (!file) return;
    try {
      validateFile(file);
      setSelectedFile(file);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid PDF.");
    }
  };

  const uploadCv = async () => {
    if (!selectedFile) return;
    setError("");
    try {
      validateFile(selectedFile);
      if (!confirmedNoPhone) {
        throw new Error("Confirm the public CV does not contain a phone number.");
      }

      setUploading(true);
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Missing admin token.");

      const uploadUrlRes = await fetch(`${process.env.NEXT_PUBLIC_API_BROWSER}/api/cv/upload-url`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          filename: selectedFile.name,
          content_type: selectedFile.type,
          size: selectedFile.size,
        }),
      });
      if (!uploadUrlRes.ok) throw new Error("Failed to prepare the CV upload.");
      const { upload_url, file_url, key } = await uploadUrlRes.json();

      const uploadRes = await fetch(upload_url, {
        method: "PUT",
        headers: { "Content-Type": selectedFile.type },
        body: selectedFile,
      });
      if (!uploadRes.ok) throw new Error("S3 rejected the CV upload.");

      const publishRes = await fetch(`${process.env.NEXT_PUBLIC_API_BROWSER}/api/cv`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          filename: selectedFile.name,
          content_type: selectedFile.type,
          size: selectedFile.size,
          key,
          file_url,
          phone_number_confirmed_absent: confirmedNoPhone,
        }),
      });
      if (!publishRes.ok) {
        const payload = await publishRes.json().catch(() => ({}));
        throw new Error(payload.detail || "Failed to publish the CV.");
      }

      setSelectedFile(null);
      setConfirmedNoPhone(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
      pushMessage("CV published", "top-center", "success");
      await fetchVersions();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  if (isCheckingAuth) {
    return (
      <Layout title="CV Upload | Laud Tetteh" description="Admin CV upload.">
        <div className="flex min-h-screen items-center justify-center bg-slate-50">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-teal-600" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="CV Upload | Laud Tetteh" description="Admin CV upload.">
      <div className={`${inter.variable} font-inter mx-auto max-w-4xl space-y-8 px-6 py-12`}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">CV Upload</h1>
            <p className="mt-2 text-sm text-slate-600">
              Publish the public downloadable CV without committing a PDF to the repo.
            </p>
          </div>
          <Link href="/admin" className={secondaryButtonClasses}>
            Back to Posts
          </Link>
        </div>

        <section className={`${cardClasses} p-6`}>
          <h2 className="text-lg font-semibold text-slate-900">Current CV</h2>
          {loading ? (
            <p className="mt-4 text-sm text-slate-600">Loading CV metadata...</p>
          ) : currentVersion ? (
            <div className="mt-4 space-y-2 text-sm text-slate-700">
              <p className="font-medium text-slate-900">{currentVersion.filename}</p>
              <p>Uploaded {new Date(currentVersion.uploaded_at).toLocaleString()}</p>
              <p>{formatSize(currentVersion.size)}</p>
              <a
                href={cvDownloadHref(currentVersion)}
                className="inline-flex text-teal-700 underline-offset-4 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Open stable public URL
              </a>
            </div>
          ) : (
            <p className="mt-4 text-sm text-slate-600">
              No current CV is published. The public About button will stay hidden.
            </p>
          )}
        </section>

        <section className={`${cardClasses} p-6`}>
          <h2 className="text-lg font-semibold text-slate-900">Upload New CV</h2>
          <div className="mt-4 space-y-4">
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf,.pdf"
              onChange={handleFileChange}
              className={inputClasses}
            />
            {selectedFile && (
              <p className="text-sm text-slate-600">
                Selected {selectedFile.name} ({formatSize(selectedFile.size)})
              </p>
            )}
            <label className="flex items-start gap-3 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={confirmedNoPhone}
                onChange={event => setConfirmedNoPhone(event.target.checked)}
                className="mt-1 h-4 w-4 accent-teal-600"
              />
              <span>
                I confirmed this public CV contains no phone number. The generated resume
                pipeline strips it automatically, but this upload can bypass that safeguard.
              </span>
            </label>
            {error && <p className="text-sm font-medium text-red-600">{error}</p>}
            <button
              onClick={uploadCv}
              disabled={!selectedFile || !confirmedNoPhone || uploading}
              className={primaryButtonClasses}
            >
              {uploading ? "Publishing..." : "Publish CV"}
            </button>
          </div>
        </section>

        <section className={`${cardClasses} p-6`}>
          <h2 className="text-lg font-semibold text-slate-900">Retained Versions</h2>
          {versions.length === 0 ? (
            <p className="mt-4 text-sm text-slate-600">No CV versions yet.</p>
          ) : (
            <div className="mt-4 divide-y divide-slate-200">
              {versions.map(version => (
                <div key={`${version.filename}-${version.uploaded_at}`} className="py-3 text-sm">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-medium text-slate-900">{version.filename}</p>
                      <p className="text-slate-600">
                        {new Date(version.uploaded_at).toLocaleString()} - {formatSize(version.size)}
                      </p>
                    </div>
                    {version.is_current && (
                      <span className="rounded-full bg-teal-100 px-3 py-1 text-xs font-semibold text-teal-800">
                        Current
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
}
