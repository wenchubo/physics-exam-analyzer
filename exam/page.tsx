"use client";

import { useRef, useState } from "react";
import Link from "next/link";

type ExamFile = {
  file: File;
  preview?: string;
};

export default function ExamPage() {
  const [files, setFiles] = useState<ExamFile[]>([]);
  const [dragging, setDragging] = useState(false);
  const [message, setMessage] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  function addFiles(selected: FileList | File[]) {
    const incoming = Array.from(selected);
    const validFiles: ExamFile[] = [];
    const errors: string[] = [];

    incoming.forEach((file) => {
      const isPDF = file.type === "application/pdf" ||
        file.name.toLowerCase().endsWith(".pdf");
      const isImage = file.type.startsWith("image/");

      if (!isPDF && !isImage) {
        errors.push(`${file.name}：只支持 PDF 或图片`);
        return;
      }

      if (file.size > 20 * 1024 * 1024) {
        errors.push(`${file.name}：文件不能超过 20 MB`);
        return;
      }

      const preview = isImage ? URL.createObjectURL(file) : undefined;
      validFiles.push({ file, preview });
    });

    setFiles((previous) => {
      const combined = [...previous, ...validFiles];
      const seen = new Set<string>();
      return combined.filter(({ file }) => {
        const key = `${file.name}-${file.size}-${file.lastModified}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
    });

    setMessage(
      errors.length
        ? errors.join("；")
        : validFiles.length
          ? `已添加 ${validFiles.length} 个文件`
          : "请选择 PDF 或图片文件"
    );
  }

  function removeFile(index: number) {
    setFiles((previous) => {
      const target = previous[index];
      if (target?.preview) URL.revokeObjectURL(target.preview);
      return previous.filter((_, i) => i !== index);
    });
  }

  function clearFiles() {
    files.forEach(({ preview }) => {
      if (preview) URL.revokeObjectURL(preview);
    });
    setFiles([]);
    setMessage("");
    if (inputRef.current) inputRef.current.value = "";
  }

  function formatSize(bytes: number) {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }

  return (
    <main className="min-h-screen bg-[#f7f5ef] text-[#25364a]">
      <header className="border-b border-[#e7e2d7] bg-white/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Link href="/physics-exam-analyzer/" className="font-bold tracking-wide">
            ◈ 物理实验室
          </Link>
          <Link
            href="/physics-exam-analyzer/"
            className="rounded-full border border-[#e4dfd4] px-4 py-2 text-sm hover:bg-[#f7f5ef]"
          >
            ← 返回首页
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-4xl px-5 py-12 md:py-16">
        <div className="mb-8">
          <p className="mb-3 text-sm font-semibold tracking-[0.2em] text-[#d97745]">
            PHYSICS LAB · EXAM ANALYSIS
          </p>
          <h1 className="text-3xl font-bold tracking-tight md:text-5xl">
            让每一道错题，都有迹可循。
          </h1>
          <p className="mt-4 max-w-2xl leading-7 text-[#718096]">
            上传你的物理试卷，整理作答与评分信息，为后续的失分分析和知识点诊断做好准备。
          </p>
        </div>

        <div className="rounded-[28px] border border-[#e8e2d7] bg-white p-5 shadow-sm md:p-8">
          <div className="mb-6 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold">第一步 · 上传试卷</h2>
              <p className="mt-1 text-sm text-[#8792a0]">
                支持 PDF、JPG、PNG 等常见图片格式
              </p>
            </div>
            <span className="rounded-full bg-[#e9f2fa] px-3 py-1.5 text-xs font-semibold text-[#426b8e]">
              单个文件 ≤ 20 MB
            </span>
          </div>

          <div
            onDragOver={(event) => {
              event.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(event) => {
              event.preventDefault();
              setDragging(false);
              addFiles(event.dataTransfer.files);
            }}
            onClick={() => inputRef.current?.click()}
            role="button"
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                inputRef.current?.click();
              }
            }}
            className={`cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition md:p-12 ${
              dragging
                ? "border-[#d97745] bg-[#fff4ec]"
                : "border-[#d8dfdf] bg-[#fbfcfa] hover:border-[#83a9c4] hover:bg-[#f5f9fb]"
            }`}
          >
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#e9f2fa] text-3xl">
              ↑
            </div>
            <p className="text-lg font-semibold">点击选择文件，或拖到这里</p>
            <p className="mt-2 text-sm text-[#8792a0]">
              可以添加试卷、答题卡或评分细则
            </p>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                inputRef.current?.click();
              }}
              className="mt-6 rounded-full bg-[#29465f] px-6 py-3 text-sm font-semibold text-white hover:bg-[#1f374b]"
            >
              选择本地文件
            </button>
            <input
              ref={inputRef}
              type="file"
              accept=".pdf,image/*"
              multiple
              className="hidden"
              onChange={(event) => {
                if (event.target.files) addFiles(event.target.files);
                event.target.value = "";
              }}
            />
          </div>

          {message && (
            <p className="mt-4 rounded-xl bg-[#f4f6f5] px-4 py-3 text-sm text-[#526879]">
              {message}
            </p>
          )}

          <div className="mt-8">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-bold">
                已选择文件 <span className="text-[#d97745]">({files.length})</span>
              </h3>
              {files.length > 0 && (
                <button
                  type="button"
                  onClick={clearFiles}
                  className="text-sm text-[#8792a0] hover:text-red-600"
                >
                  全部清除
                </button>
              )}
            </div>

            {files.length === 0 ? (
              <div className="rounded-xl border border-[#eee9e0] px-4 py-8 text-center text-sm text-[#9aa3ad]">
                还没有文件。选择试卷后，文件信息会显示在这里。
              </div>
            ) : (
              <div className="space-y-3">
                {files.map(({ file, preview }, index) => (
                  <div
                    key={`${file.name}-${file.size}-${file.lastModified}`}
                    className="flex items-center gap-4 rounded-2xl border border-[#eee9e0] p-4"
                  >
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#f0f4f6] text-xs font-bold text-[#426b8e]">
                      {preview ? (
                        <img
                          src={preview}
                          alt={file.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        "PDF"
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="break-all font-medium">{file.name}</p>
                      <p className="mt-1 text-xs text-[#8792a0]">
                        {formatSize(file.size)} ·{" "}
                        {file.type || "文件类型待确认"}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      aria-label={`删除 ${file.name}`}
                      className="rounded-full px-3 py-2 text-sm text-[#8792a0] hover:bg-red-50 hover:text-red-600"
                    >
                      删除
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-8 rounded-2xl bg-[#fff6ed] p-5">
            <h3 className="font-bold text-[#9a5b32]">接下来会做什么？</h3>
            <div className="mt-3 grid gap-3 text-sm leading-6 text-[#856b59] md:grid-cols-3">
              <p>01 · 整理你的作答</p>
              <p>02 · 对照标准答案与评分细则</p>
              <p>03 · 生成错题与知识点分析</p>
            </div>
            <p className="mt-4 text-xs leading-5 text-[#9a8778]">
              当前版本仅在浏览器中选择和预览文件，不会将文件上传到服务器，也尚未接入 OCR 或 AI 自动批改。刷新或离开页面后，所选文件不会保留。
            </p>
          </div>
        </div>

        <p className="mt-6 text-center text-xs leading-6 text-[#9aa3ad]">
          物理实验室 · 把每一次失分，变成下一次进步的线索。
        </p>
      </section>
    </main>
  );
}
