import React from "react";
import {
  Composition,
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  Sequence,
} from "remotion";

// ─── Colors ───
const COLORS = {
  bg: "#0a0a14",
  bgLight: "#10101e",
  blue: "#3b82f6",
  orange: "#f97316",
  text: "#f0f0f8",
  textMuted: "#8888aa",
  card: "#161624",
  border: "#2a2a3e",
};

// ─── Slide: Problem ───
const ProblemSlide: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleY = spring({ frame, fps, from: 40, to: 0, config: { damping: 14 } });
  const titleOp = spring({ frame, fps, from: 0, to: 1, config: { damping: 14 } });

  const items = [
    "🔧 Forgot oil change... again",
    "📋 Lost the receipt",
    "💸 Surprise $800 repair bill",
    "🤷 When was the last service?",
  ];

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.bg,
        justifyContent: "center",
        alignItems: "center",
        padding: 60,
      }}
    >
      {/* Warning icon */}
      <div
        style={{
          fontSize: 80,
          marginBottom: 32,
          opacity: interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" }),
          transform: `scale(${spring({ frame, fps, from: 0.5, to: 1, config: { damping: 10, mass: 0.8 } })})`,
        }}
      >
        ⚠️
      </div>

      <div
        style={{
          fontSize: 48,
          fontWeight: 800,
          color: COLORS.text,
          textAlign: "center",
          lineHeight: 1.2,
          opacity: titleOp,
          transform: `translateY(${titleY}px)`,
          marginBottom: 48,
        }}
      >
        Sound familiar?
      </div>

      <div style={{ width: "100%", maxWidth: 700 }}>
        {items.map((item, i) => {
          const delay = 15 + i * 12;
          const itemOp = interpolate(frame, [delay, delay + 10], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const itemX = spring({
            frame: Math.max(0, frame - delay),
            fps,
            from: 60,
            to: 0,
            config: { damping: 14 },
          });

          return (
            <div
              key={i}
              style={{
                fontSize: 32,
                color: COLORS.textMuted,
                padding: "16px 24px",
                marginBottom: 12,
                background: COLORS.card,
                borderRadius: 16,
                border: `1px solid ${COLORS.border}`,
                opacity: itemOp,
                transform: `translateX(${itemX}px)`,
              }}
            >
              {item}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ─── Slide: Solution ───
const SolutionSlide: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({ frame, fps, from: 0.8, to: 1, config: { damping: 12 } });
  const opacity = spring({ frame, fps, from: 0, to: 1, config: { damping: 14 } });

  const tagOp = interpolate(frame, [20, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at 50% 60%, ${COLORS.blue}22, ${COLORS.bg} 70%)`,
        justifyContent: "center",
        alignItems: "center",
        padding: 60,
      }}
    >
      <div
        style={{
          opacity,
          transform: `scale(${scale})`,
          textAlign: "center",
        }}
      >
        {/* App icon */}
        <div
          style={{
            width: 120,
            height: 120,
            borderRadius: 28,
            background: `linear-gradient(135deg, ${COLORS.blue}, ${COLORS.orange})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 56,
            margin: "0 auto 36px",
            boxShadow: `0 20px 60px ${COLORS.blue}44`,
          }}
        >
          🚗
        </div>

        <div
          style={{
            fontSize: 52,
            fontWeight: 800,
            color: COLORS.text,
            lineHeight: 1.15,
            marginBottom: 20,
          }}
        >
          Car Maintenance
          <br />
          Log
        </div>

        <div
          style={{
            fontSize: 28,
            color: COLORS.textMuted,
            marginBottom: 32,
          }}
        >
          Track everything. Forget nothing.
        </div>

        <div
          style={{
            display: "flex",
            gap: 12,
            justifyContent: "center",
            opacity: tagOp,
          }}
        >
          {["Offline-first", "No subscription", "$4.99"].map((tag, i) => (
            <div
              key={i}
              style={{
                background: `${COLORS.blue}22`,
                border: `1px solid ${COLORS.blue}44`,
                color: COLORS.blue,
                padding: "10px 20px",
                borderRadius: 99,
                fontSize: 22,
                fontWeight: 600,
              }}
            >
              {tag}
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Slide: Features ───
const FeaturesSlide: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const features = [
    { icon: "🚗", title: "Multi-Vehicle", desc: "Track all your cars" },
    { icon: "📸", title: "Photo Receipts", desc: "Snap & save invoices" },
    { icon: "⏰", title: "Reminders", desc: "By date or mileage" },
    { icon: "📊", title: "Cost Stats", desc: "Know what you spend" },
  ];

  const titleOp = spring({ frame, fps, from: 0, to: 1, config: { damping: 14 } });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.bg,
        justifyContent: "center",
        alignItems: "center",
        padding: 50,
      }}
    >
      <div
        style={{
          fontSize: 44,
          fontWeight: 800,
          color: COLORS.text,
          textAlign: "center",
          marginBottom: 48,
          opacity: titleOp,
        }}
      >
        Everything you need
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 20,
          width: "100%",
          maxWidth: 750,
        }}
      >
        {features.map((f, i) => {
          const delay = 8 + i * 10;
          const cardScale = spring({
            frame: Math.max(0, frame - delay),
            fps,
            from: 0.85,
            to: 1,
            config: { damping: 12 },
          });
          const cardOp = interpolate(frame, [delay, delay + 8], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          return (
            <div
              key={i}
              style={{
                background: COLORS.card,
                border: `1px solid ${COLORS.border}`,
                borderRadius: 20,
                padding: "36px 28px",
                textAlign: "center",
                opacity: cardOp,
                transform: `scale(${cardScale})`,
              }}
            >
              <div style={{ fontSize: 48, marginBottom: 12 }}>{f.icon}</div>
              <div
                style={{
                  fontSize: 26,
                  fontWeight: 700,
                  color: COLORS.text,
                  marginBottom: 6,
                }}
              >
                {f.title}
              </div>
              <div style={{ fontSize: 20, color: COLORS.textMuted }}>
                {f.desc}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ─── Slide: CTA ───
const CTASlide: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({ frame, fps, from: 0.9, to: 1, config: { damping: 12 } });
  const opacity = spring({ frame, fps, from: 0, to: 1, config: { damping: 14 } });

  const pulseScale = interpolate(
    Math.sin((frame / fps) * Math.PI * 2),
    [-1, 1],
    [0.97, 1.03]
  );

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(180deg, ${COLORS.bg} 0%, #0d0d20 100%)`,
        justifyContent: "center",
        alignItems: "center",
        padding: 60,
      }}
    >
      <div
        style={{
          opacity,
          transform: `scale(${scale})`,
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: 52,
            fontWeight: 800,
            color: COLORS.text,
            lineHeight: 1.2,
            marginBottom: 24,
          }}
        >
          Stop guessing.
          <br />
          <span style={{ color: COLORS.blue }}>Start tracking.</span>
        </div>

        <div
          style={{
            fontSize: 26,
            color: COLORS.textMuted,
            marginBottom: 48,
          }}
        >
          Your car deserves better. So does your wallet.
        </div>

        <div
          style={{
            transform: `scale(${pulseScale})`,
          }}
        >
          <div
            style={{
              background: `linear-gradient(135deg, ${COLORS.blue}, ${COLORS.orange})`,
              color: "#fff",
              fontSize: 32,
              fontWeight: 700,
              padding: "22px 56px",
              borderRadius: 16,
              display: "inline-block",
              boxShadow: `0 12px 40px ${COLORS.blue}55`,
            }}
          >
            Get it now — $4.99
          </div>
        </div>

        <div
          style={{
            marginTop: 28,
            fontSize: 20,
            color: COLORS.textMuted,
          }}
        >
          One-time purchase · No subscription · Works offline
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Main Composition Root ───
export const PromoVideo: React.FC = () => {
  return (
    <>
      <Composition
        id="PromoVideo"
        component={PromoVideoComp}
        durationInFrames={360}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{}}
      />
    </>
  );
};

const PromoVideoComp: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.bg,
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* Problem: 0-90 (3s) */}
      <Sequence from={0} durationInFrames={90}>
        <ProblemSlide />
      </Sequence>

      {/* Solution: 90-180 (3s) */}
      <Sequence from={90} durationInFrames={90}>
        <SolutionSlide />
      </Sequence>

      {/* Features: 180-270 (3s) */}
      <Sequence from={180} durationInFrames={90}>
        <FeaturesSlide />
      </Sequence>

      {/* CTA: 270-360 (3s) */}
      <Sequence from={270} durationInFrames={90}>
        <CTASlide />
      </Sequence>
    </AbsoluteFill>
  );
};
