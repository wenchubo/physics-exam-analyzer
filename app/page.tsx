"use client";

import { useRef, useState } from "react";
import {
  Upload,
  FileImage,
  X,
  ArrowRight,
  Sparkles,
  BookOpen,
  Target,
  BrainCircuit,
} from "lucide-react";

export default function HomePage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [dragging, setDragging] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [message, setMessage] = useState("");

  function addFiles(selected: FileList | null) {
    if (!selected) return;

    const validFiles = Array.from(selected).filter((file) =>
      ["image/jpeg", "image/png", "image/webp"].includes(file.type)
    );

    if (validFiles.length === 0) {
      setMessage("请选择 JPG、PNG 或 WEBP 格式的答题卡图片。");
      return;
    }

    setFiles((previous) => {
      const combined = [...previous, ...validFiles];
      return combined.slice(0, 5);
    });

    setMessage("");
  }

  function removeFile(index: number) {
    setFiles((previous) => previous.filter((_, i) => i !== index));
  }

  async function analyze() {
    if (files.length === 0) {
      setMessage("请先上传答题卡图片。");
      return;
    }

    setAnalyzing(true);
    setMessage("");

    try {
      const formData = new FormData();

      files.forEach((file) => {
        formData.append("images", file);
      });

      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "分析失败，请稍后重试。");
      }

      sessionStorage.setItem("physics-analysis", JSON.stringify(data));
   window.location.href = "/physics-exam-analyzer/report";
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "发生未知错误，请稍后重试。"
      );
    } finally {
      setAnalyzing(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#fafbfc] text-[#172033]">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <a href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
            <BrainCircuit size={23} />
          </div>
          <div>
            <div className="text-lg font-bold tracking-tight">物理 AI 智批</div>
            <div className="text-xs text-gray-500">让每一道错题都有价值</div>
          </div>
        </a>

        <div className="hidden items-center gap-6 text-sm text-gray-500 sm:flex">
          <span>智能错题分析</span>
          <span>知识点诊断</span>
          <a href="/physics-exam-analyzer/practice" className="hover:text-blue-600">
            举一反三
          </a>
        </div>
      </header>

      <section className="mx-auto max-w-4xl px-6 pb-20 pt-12 sm:pt-20">
        <div className="mb-8 text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm text-blue-700">
            <Sparkles size={15} />
            专注高中物理学习
          </div>

          <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-6xl">
            从一道错题，
            <br />
            <span className="text-blue-600">找到真正的问题。</span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-gray-500 sm:text-lg">
            上传老师批改过的物理答题卡，整理错题、分析知识漏洞，让每一次订正都更有方向。
          </p>
        </div>

        <div
          className={`rounded-3xl border-2 border-dashed bg-white p-6 shadow-sm transition sm:p-10 ${
            dragging
              ? "border-blue-500 bg-blue-50"
              : "border-gray-200 hover:border-blue-300"
          }`}
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
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            className="hidden"
            onChange={(event) => {
              addFiles(event.target.files);
              event.target.value = "";
            }}
          />

          {files.length === 0 ? (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex w-full flex-col items-center py-8 text-center"
            >
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <Upload size={30} />
              </div>
              <span className="text-lg font-semibold">上传物理答题卡</span>
              <span className="mt-2 text-sm text-gray-500">
                点击选择图片，或将图片拖到这里
              </span>
              <span className="mt-4 text-xs text-gray-400">
                支持 JPG、PNG、WEBP，最多 5 张
              </span>
            </button>
          ) : (
            <div>
              <div className="mb-5 flex items-center justify-between">
                <h2 className="font-semibold">已选择 {files.length} 张图片</h2>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-sm text-blue-600 hover:underline"
                >
                  继续添加
                </button>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {files.map((file, index) => (
                  <div
                    key={`${file.name}-${index}`}
                    className="flex items-center gap-3 rounded-xl border border-gray-200 p-3"
                  >
                    <FileImage className="shrink-0 text-blue-600" size={25} />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium">
                        {file.name}
                      </div>
                      <div className="text-xs text-gray-400">
                        {(file.size / 1024).toFixed(0)} KB
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      aria-label="删除图片"
                      className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-red-500"
                    >
                      <X size={17} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 border-t border-gray-100 pt-6">
            <button
              type="button"
              disabled={files.length === 0 || analyzing}
              onClick={analyze}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-4 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              {analyzing ? "正在分析，请稍候……" : "开始智能分析"}
              {!analyzing && <ArrowRight size={18} />}
            </button>

            {message && (
              <p className="mt-4 text-center text-sm text-red-600">
                {message}
              </p>
            )}
          </div>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {[
            {
              icon: BookOpen,
              title: "错题整理",
              description: "集中查看需要订正的题目",
            },
            {
              icon: Target,
              title: "知识点诊断",
              description: "发现还没掌握的物理概念",
            },
            {
              icon: Sparkles,
              title: "举一反三",
              description: "围绕薄弱知识点练习",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-gray-100 bg-white p-5"
            >
              <item.icon className="mb-4 text-blue-600" size={23} />
              <h3 className="font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-gray-500">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-xs leading-5 text-gray-400">
          当前为开发中的学习工具。AI 分析结果需要结合原试卷与评分标准核对。
          <br />
          请勿上传包含身份证号、家庭住址等敏感个人信息的图片。
        </p>
      </section>
    </main>
  );
}
