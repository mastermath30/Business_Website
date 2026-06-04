"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { getUser, type StoredUser } from "@/lib/localStorage";
import { ThemeToggle } from "@/components/ui/curtain-theme-toggle";

type Uniforms = {
  [key: string]: {
    value: number[] | number[][] | number;
    type: string;
  };
};

interface ShaderProps {
  source: string;
  uniforms: {
    [key: string]: {
      value: number[] | number[][] | number;
      type: string;
    };
  };
  maxFps?: number;
}

interface SignInPageProps {
  className?: string;
}

export const CanvasRevealEffect = ({
  animationSpeed = 10,
  opacities = [0.3, 0.3, 0.3, 0.5, 0.5, 0.5, 0.8, 0.8, 0.8, 1],
  colors = [[0, 255, 255]],
  containerClassName,
  dotSize,
  showGradient = true,
  reverse = false, // This controls the direction
}: {
  animationSpeed?: number;
  opacities?: number[];
  colors?: number[][];
  containerClassName?: string;
  dotSize?: number;
  showGradient?: boolean;
  reverse?: boolean; // This prop determines the direction
}) => {
  return (
    <div className={cn("h-full relative w-full", containerClassName)}>
      <div className="h-full w-full">
        <DotMatrix
          colors={colors ?? [[0, 255, 255]]}
          dotSize={dotSize ?? 3}
          opacities={
            opacities ?? [0.3, 0.3, 0.3, 0.5, 0.5, 0.5, 0.8, 0.8, 0.8, 1]
          }
          // Pass reverse state and speed via string flags in the empty shader prop
          shader={`
            ${reverse ? 'u_reverse_active' : 'false'}_;
            animation_speed_factor_${animationSpeed.toFixed(1)}_;
          `}
          center={["x", "y"]}
        />
      </div>
      {showGradient && (
        // Tinted with the site's dark base instead of pure black
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
      )}
    </div>
  );
};

interface DotMatrixProps {
  colors?: number[][];
  opacities?: number[];
  totalSize?: number;
  dotSize?: number;
  shader?: string;
  center?: ("x" | "y")[];
}

const DotMatrix: React.FC<DotMatrixProps> = ({
  colors = [[0, 0, 0]],
  opacities = [0.04, 0.04, 0.04, 0.04, 0.04, 0.08, 0.08, 0.08, 0.08, 0.14],
  totalSize = 20,
  dotSize = 2,
  shader = "", // This shader string will now contain the animation logic
  center = ["x", "y"],
}) => {
  // ... uniforms calculation remains the same for colors, opacities, etc.
  const uniforms = React.useMemo(() => {
    let colorsArray = [
      colors[0],
      colors[0],
      colors[0],
      colors[0],
      colors[0],
      colors[0],
    ];
    if (colors.length === 2) {
      colorsArray = [
        colors[0],
        colors[0],
        colors[0],
        colors[1],
        colors[1],
        colors[1],
      ];
    } else if (colors.length === 3) {
      colorsArray = [
        colors[0],
        colors[0],
        colors[1],
        colors[1],
        colors[2],
        colors[2],
      ];
    }
    return {
      u_colors: {
        value: colorsArray.map((color) => [
          color[0] / 255,
          color[1] / 255,
          color[2] / 255,
        ]),
        type: "uniform3fv",
      },
      u_opacities: {
        value: opacities,
        type: "uniform1fv",
      },
      u_total_size: {
        value: totalSize,
        type: "uniform1f",
      },
      u_dot_size: {
        value: dotSize,
        type: "uniform1f",
      },
      u_reverse: {
        value: shader.includes("u_reverse_active") ? 1 : 0, // Convert boolean to number (1 or 0)
        type: "uniform1i", // Use 1i for bool in WebGL1/GLSL100, or just bool for GLSL300+ if supported
      },
    };
  }, [colors, opacities, totalSize, dotSize, shader]); // Add shader to dependencies

  return (
    <Shader
      // The main animation logic is now built *outside* the shader prop
      source={`
        precision mediump float;
        in vec2 fragCoord;

        uniform float u_time;
        uniform float u_opacities[10];
        uniform vec3 u_colors[6];
        uniform float u_total_size;
        uniform float u_dot_size;
        uniform vec2 u_resolution;
        uniform int u_reverse; // Changed from bool to int

        out vec4 fragColor;

        float PHI = 1.61803398874989484820459;
        float random(vec2 xy) {
            return fract(tan(distance(xy * PHI, xy) * 0.5) * xy.x);
        }
        float map(float value, float min1, float max1, float min2, float max2) {
            return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
        }

        void main() {
            vec2 st = fragCoord.xy;
            ${
              center.includes("x")
                ? "st.x -= abs(floor((mod(u_resolution.x, u_total_size) - u_dot_size) * 0.5));"
                : ""
            }
            ${
              center.includes("y")
                ? "st.y -= abs(floor((mod(u_resolution.y, u_total_size) - u_dot_size) * 0.5));"
                : ""
            }

            float opacity = step(0.0, st.x);
            opacity *= step(0.0, st.y);

            vec2 st2 = vec2(int(st.x / u_total_size), int(st.y / u_total_size));

            float frequency = 5.0;
            float show_offset = random(st2); // Used for initial opacity random pick and color
            float rand = random(st2 * floor((u_time / frequency) + show_offset + frequency));
            opacity *= u_opacities[int(rand * 10.0)];
            opacity *= 1.0 - step(u_dot_size / u_total_size, fract(st.x / u_total_size));
            opacity *= 1.0 - step(u_dot_size / u_total_size, fract(st.y / u_total_size));

            vec3 color = u_colors[int(show_offset * 6.0)];

            // --- Animation Timing Logic ---
            float animation_speed_factor = 0.5; // Extract speed from shader string
            vec2 center_grid = u_resolution / 2.0 / u_total_size;
            float dist_from_center = distance(center_grid, st2);

            // Calculate timing offset for Intro (from center)
            float timing_offset_intro = dist_from_center * 0.01 + (random(st2) * 0.15);

            // Calculate timing offset for Outro (from edges)
            // Max distance from center to a corner of the grid
            float max_grid_dist = distance(center_grid, vec2(0.0, 0.0));
            float timing_offset_outro = (max_grid_dist - dist_from_center) * 0.02 + (random(st2 + 42.0) * 0.2);


            float current_timing_offset;
            if (u_reverse == 1) {
                current_timing_offset = timing_offset_outro;
                 // Outro logic: opacity starts high, goes to 0 when time passes offset
                 opacity *= 1.0 - step(current_timing_offset, u_time * animation_speed_factor);
                 // Clamp for fade-out transition
                 opacity *= clamp((step(current_timing_offset + 0.1, u_time * animation_speed_factor)) * 1.25, 1.0, 1.25);
            } else {
                current_timing_offset = timing_offset_intro;
                 // Intro logic: opacity starts 0, goes to base opacity when time passes offset
                 opacity *= step(current_timing_offset, u_time * animation_speed_factor);
                 // Clamp for fade-in transition
                 opacity *= clamp((1.0 - step(current_timing_offset + 0.1, u_time * animation_speed_factor)) * 1.25, 1.0, 1.25);
            }


            fragColor = vec4(color, opacity);
            fragColor.rgb *= fragColor.a; // Premultiply alpha
        }`}
      uniforms={uniforms}
      maxFps={60}
    />
  );
};


const ShaderMaterial = ({
  source,
  uniforms,
  maxFps = 60,
}: {
  source: string;
  hovered?: boolean;
  maxFps?: number;
  uniforms: Uniforms;
}) => {
  const { size } = useThree();
  const ref = useRef<THREE.Mesh>(null);
  let lastFrameTime = 0;

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const timestamp = clock.getElapsedTime();

    lastFrameTime = timestamp;

    const material: any = ref.current.material;
    const timeLocation = material.uniforms.u_time;
    timeLocation.value = timestamp;
  });

  const getUniforms = () => {
    const preparedUniforms: any = {};

    for (const uniformName in uniforms) {
      const uniform: any = uniforms[uniformName];

      switch (uniform.type) {
        case "uniform1f":
          preparedUniforms[uniformName] = { value: uniform.value, type: "1f" };
          break;
        case "uniform1i":
          preparedUniforms[uniformName] = { value: uniform.value, type: "1i" };
          break;
        case "uniform3f":
          preparedUniforms[uniformName] = {
            value: new THREE.Vector3().fromArray(uniform.value),
            type: "3f",
          };
          break;
        case "uniform1fv":
          preparedUniforms[uniformName] = { value: uniform.value, type: "1fv" };
          break;
        case "uniform3fv":
          preparedUniforms[uniformName] = {
            value: uniform.value.map((v: number[]) =>
              new THREE.Vector3().fromArray(v)
            ),
            type: "3fv",
          };
          break;
        case "uniform2f":
          preparedUniforms[uniformName] = {
            value: new THREE.Vector2().fromArray(uniform.value),
            type: "2f",
          };
          break;
        default:
          console.error(`Invalid uniform type for '${uniformName}'.`);
          break;
      }
    }

    preparedUniforms["u_time"] = { value: 0, type: "1f" };
    preparedUniforms["u_resolution"] = {
      value: new THREE.Vector2(size.width * 2, size.height * 2),
    }; // Initialize u_resolution
    return preparedUniforms;
  };

  // Shader material
  const material = useMemo(() => {
    const materialObject = new THREE.ShaderMaterial({
      vertexShader: `
      precision mediump float;
      in vec2 coordinates;
      uniform vec2 u_resolution;
      out vec2 fragCoord;
      void main(){
        float x = position.x;
        float y = position.y;
        gl_Position = vec4(x, y, 0.0, 1.0);
        fragCoord = (position.xy + vec2(1.0)) * 0.5 * u_resolution;
        fragCoord.y = u_resolution.y - fragCoord.y;
      }
      `,
      fragmentShader: source,
      uniforms: getUniforms(),
      glslVersion: THREE.GLSL3,
      blending: THREE.CustomBlending,
      blendSrc: THREE.SrcAlphaFactor,
      blendDst: THREE.OneFactor,
    });

    return materialObject;
  }, [size.width, size.height, source]);

  return (
    <mesh ref={ref as any}>
      <planeGeometry args={[2, 2]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
};

const Shader: React.FC<ShaderProps> = ({ source, uniforms, maxFps = 60 }) => {
  return (
    <Canvas className="absolute inset-0  h-full w-full">
      <ShaderMaterial source={source} uniforms={uniforms} maxFps={maxFps} />
    </Canvas>
  );
};

// ─── MiniNavbar — mirrors the site's real Navbar.tsx (pill, logo, links, ─────
//     avatar, theme toggle). Login/Signup intentionally omitted per design.

const navLinks = [
  { href: "/#features", label: "Features" },
  { href: "/study", label: "Study Tool" },
];

function MiniNavbar() {
  const [user, setUser] = useState<StoredUser | null>(null);

  useEffect(() => {
    setUser(getUser());
  }, []);

  const initial = user?.name.charAt(0).toUpperCase() ?? "M";
  const firstName = user?.name.split(" ")[0] ?? "Malhar";

  return (
    <motion.nav
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      style={{
        minHeight: "72px",
        width: "100%",
        maxWidth: "860px",
        margin: "16px auto 0",
        padding: "0 32px",
        display: "flex",
        alignItems: "center",
        gap: "40px",
        borderRadius: "9999px",
        background: "var(--nav-bg)",
        backdropFilter: "blur(16px) saturate(180%)",
        WebkitBackdropFilter: "blur(16px) saturate(180%)",
        border: "1px solid var(--nav-border)",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
      }}
    >
      {/* Logo + brand — copied from Logo.tsx */}
      <Link
        href="/"
        className="group inline-flex items-center font-display tracking-tight"
        style={{ gap: "12px" }}
      >
        <img
          src="/TeslaSTEMlogo.png"
          alt="Tesla STEM High School"
          className="h-10 w-auto"
          style={{ objectFit: "contain", flexShrink: 0 }}
        />
        <span
          aria-hidden
          className="bg-foreground/10 dark:bg-foreground/20"
          style={{ height: "28px", width: "1px", flexShrink: 0 }}
        />
        <span
          className="text-foreground"
          style={{
            fontSize: "20px",
            fontWeight: 700,
            lineHeight: 1,
            whiteSpace: "nowrap",
          }}
        >
          Business
          <span className="text-muted-foreground" style={{ fontWeight: 700 }}>
            Boost
          </span>
        </span>
      </Link>

      <ul
        style={{
          fontSize: "16px",
          display: "flex",
          gap: "36px",
          listStyle: "none",
          margin: 0,
          padding: 0,
        }}
        className="hidden md:flex"
      >
        {navLinks.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="group relative transition-colors duration-200 ease-out text-foreground/60 hover:text-foreground"
              style={{
                fontSize: "15px",
                fontWeight: 500,
                lineHeight: 1,
                letterSpacing: "-0.005em",
              }}
            >
              {l.label}
              <span
                aria-hidden
                className="absolute left-0 right-0 h-[2px] origin-center scale-x-0 rounded-full transition-transform duration-200 ease-out group-hover:scale-x-100"
                style={{ background: "#16a34a", bottom: "-8px" }}
              />
            </Link>
          </li>
        ))}
      </ul>

      {/* Right side — avatar pill + theme toggle */}
      <div
        style={{
          marginLeft: "auto",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <Link
          href="/study"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "6px 14px 6px 6px",
            borderRadius: "9999px",
            border: "1px solid var(--surface-border)",
            background: "var(--surface-1)",
            textDecoration: "none",
            fontSize: "14px",
            fontWeight: 500,
            color: "hsl(var(--foreground) / 0.65)",
          }}
        >
          <span
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "28px",
              height: "28px",
              borderRadius: "50%",
              background: "#16a34a",
              color: "#ffffff",
              fontSize: "12px",
              fontWeight: 700,
              flexShrink: 0,
            }}
          >
            {initial}
          </span>
          <span className="hidden sm:block">{firstName}</span>
        </Link>

        {/* Dark mode toggle — curtain animation, same as real Navbar */}
        <ThemeToggle variant="icon" buttonSize={36} duration={600} />
      </div>
    </motion.nav>
  );
}

function ErrorMsg({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-600 dark:text-red-400"
    >
      {children}
    </motion.div>
  );
}

function SignupHint() {
  return (
    <p className="mt-6 text-center text-sm text-gray-500 dark:text-white/50">
      Don&apos;t have an account?{" "}
      <Link
        href="/signup"
        className="font-semibold text-[#16a34a] transition-colors hover:text-[#15803d]"
      >
        Sign up
      </Link>
    </p>
  );
}

const STEP_TRANSITION = { duration: 0.4, ease: "easeOut" } as const;

export const SignInPage = ({ className }: SignInPageProps) => {
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const [step, setStep] = useState<"email" | "password" | "success">("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialCanvasVisible, setInitialCanvasVisible] = useState(true);
  const [reverseCanvasVisible, setReverseCanvasVisible] = useState(false);

  useEffect(() => setMounted(true), []);

  // Already authenticated → straight to the study tool.
  useEffect(() => {
    if (getUser()) router.replace("/study");
  }, [router]);

  const isDark = mounted ? resolvedTheme === "dark" : false;

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }
    setStep("password");
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!password) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    const stored = getUser();
    if (!stored || stored.email !== email.trim().toLowerCase()) {
      setError("No account found with that email. Sign up first.");
      setLoading(false);
      return;
    }
    // Success: play the reverse dot animation, then reveal the success card
    setReverseCanvasVisible(true);
    setTimeout(() => setInitialCanvasVisible(false), 50);
    setTimeout(() => {
      setStep("success");
      setLoading(false);
    }, 1600);
  };

  const handleBackToEmail = () => {
    setError("");
    setPassword("");
    setStep("email");
  };

  // Theme-aware dot field: dark keeps the blue+green look; light is subtle blue
  const dotColors = isDark
    ? [
        [37, 99, 168],
        [22, 163, 74],
      ]
    : [[37, 99, 168]];
  const dotOpacities = isDark
    ? [0.3, 0.3, 0.3, 0.5, 0.5, 0.5, 0.8, 0.8, 0.8, 1]
    : [0.1, 0.1, 0.1, 0.15, 0.15, 0.15, 0.2, 0.2, 0.2, 0.25];

  const cardClass =
    "relative w-full min-w-[380px] max-w-[420px] rounded-2xl p-8 md:p-10 " +
    "bg-white border border-gray-200 shadow-xl " +
    "dark:bg-white/5 dark:backdrop-blur-md dark:border-white/10 dark:shadow-none";

  return (
    <div
      className={cn(
        "flex w-full flex-col min-h-screen relative bg-white dark:bg-[#0a0a0a]",
        className
      )}
    >
      {/* Dot-matrix background */}
      <div className="absolute inset-0 z-0">
        {initialCanvasVisible && (
          <div className="absolute inset-0">
            <CanvasRevealEffect
              animationSpeed={isDark ? 3 : 2}
              containerClassName="bg-white dark:bg-[#0a0a0a]"
              colors={dotColors}
              opacities={dotOpacities}
              dotSize={6}
              reverse={false}
              showGradient={false}
            />
          </div>
        )}

        {reverseCanvasVisible && (
          <div className="absolute inset-0">
            <CanvasRevealEffect
              animationSpeed={isDark ? 4 : 2}
              containerClassName="bg-white dark:bg-[#0a0a0a]"
              colors={dotColors}
              opacities={dotOpacities}
              dotSize={6}
              reverse={true}
              showGradient={false}
            />
          </div>
        )}

        {/* Light: soft white wash keeps the card readable */}
        <div className="absolute inset-0 bg-gradient-to-t from-white/80 to-transparent dark:hidden" />
        {/* Dark: original black radial vignette */}
        <div className="absolute inset-0 hidden dark:block bg-[radial-gradient(circle_at_center,_rgba(7,11,20,1)_0%,_transparent_100%)]" />
        <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-white to-transparent dark:from-[#0a0a0a]" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col flex-1">
        <MiniNavbar />

        <div className="flex flex-1 items-center justify-center px-4 py-24">
          <div className={cardClass}>
            {/* Constant header */}
            <div className="flex flex-col items-center gap-1.5 text-center">
              <img
                src="/TeslaSTEMlogo.png"
                alt="Tesla STEM High School"
                className="h-12 w-auto object-contain"
              />
              <span className="text-xs text-gray-500 dark:text-white/50">
                Nikola Tesla STEM High School
              </span>
            </div>

            <AnimatePresence mode="wait">
              {step === "email" ? (
                <motion.div
                  key="email-step"
                  initial={{ opacity: 0, x: -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={STEP_TRANSITION}
                >
                  <div className="mt-6 text-center">
                    <h1 className="text-[2rem] font-bold leading-tight tracking-tight text-gray-900 dark:text-[#f2f2f2]">
                      Welcome back
                    </h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-white/50">
                      Log in to your BusinessBoost account
                    </p>
                  </div>

                  <form
                    onSubmit={handleEmailSubmit}
                    className="mt-6 flex flex-col gap-4"
                  >
                    <div>
                      <label className="text-mid mb-1.5 block text-[13px] font-medium">
                        Email
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        autoFocus
                        className="field-base w-full rounded-lg px-4 py-2.5 text-[15px]"
                      />
                    </div>

                    {error && <ErrorMsg>{error}</ErrorMsg>}

                    <button
                      type="submit"
                      className="mt-1 w-full rounded-full bg-[#16a34a] py-3 font-semibold text-white transition-colors hover:bg-[#15803d]"
                    >
                      Continue
                    </button>
                  </form>

                  <SignupHint />
                </motion.div>
              ) : step === "password" ? (
                <motion.div
                  key="password-step"
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 40 }}
                  transition={STEP_TRANSITION}
                >
                  <div className="mt-6 text-center">
                    <h1 className="text-[2rem] font-bold leading-tight tracking-tight text-gray-900 dark:text-[#f2f2f2]">
                      Welcome back
                    </h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-white/50">
                      Enter the password for {email}
                    </p>
                  </div>

                  <form
                    onSubmit={handlePasswordSubmit}
                    className="mt-6 flex flex-col gap-4"
                  >
                    <div>
                      <label className="text-mid mb-1.5 block text-[13px] font-medium">
                        Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          autoFocus
                          className="field-base w-full rounded-lg px-4 py-2.5 pr-11 text-[15px]"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((v) => !v)}
                          aria-label={
                            showPassword ? "Hide password" : "Show password"
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-600 dark:text-white/40 dark:hover:text-white/70"
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    {error && <ErrorMsg>{error}</ErrorMsg>}

                    <button
                      type="submit"
                      disabled={loading}
                      className="mt-1 w-full rounded-full bg-[#16a34a] py-3 font-semibold text-white transition-colors hover:bg-[#15803d] disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {loading ? "Logging in…" : "Log in"}
                    </button>

                    <button
                      type="button"
                      onClick={handleBackToEmail}
                      className="text-xs text-gray-500 transition-colors hover:text-gray-800 dark:text-white/40 dark:hover:text-white/70"
                    >
                      ← Use a different email
                    </button>
                  </form>

                  <SignupHint />
                </motion.div>
              ) : (
                <motion.div
                  key="success-step"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: "easeOut", delay: 0.3 }}
                  className="text-center"
                >
                  <div className="mt-6 space-y-1">
                    <h1 className="text-[2rem] font-bold leading-tight tracking-tight text-gray-900 dark:text-[#f2f2f2]">
                      You&apos;re in!
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-white/50">
                      Welcome
                    </p>
                  </div>

                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="py-10"
                  >
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#16a34a] to-[#2563a8]">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8 text-white"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </motion.div>

                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    onClick={() => router.push("/study")}
                    className="w-full rounded-full bg-[#16a34a] py-3 font-semibold text-white transition-colors hover:bg-[#15803d]"
                  >
                    Continue to Study Tool
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};
