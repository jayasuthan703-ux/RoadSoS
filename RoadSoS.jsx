import { useState, useEffect, useRef } from "react";

const emergencyServices = [
  {
    id: 1,
    type: "Hospital",
    name: "Apollo Trauma Centre",
    distance: "0.8 km",
    time: "3 min",
    phone: "1066",
    address: "Anna Salai, Chennai",
    icon: "🏥",
    color: "#FF4757",
    available: true,
  },
  {
    id: 2,
    type: "Ambulance",
    name: "108 Emergency Ambulance",
    distance: "1.2 km",
    time: "4 min",
    phone: "108",
    address: "Nearest dispatch unit",
    icon: "🚑",
    color: "#FF6B35",
    available: true,
  },
  {
    id: 3,
    type: "Police",
    name: "Traffic Police Control",
    distance: "1.5 km",
    time: "5 min",
    phone: "100",
    address: "Mount Road Station",
    icon: "🚔",
    color: "#1E90FF",
    available: true,
  },
  {
    id: 4,
    type: "Fire & Rescue",
    name: "Vehicle Rescue Unit",
    distance: "2.1 km",
    time: "7 min",
    phone: "101",
    address: "Egmore Fire Station",
    icon: "🚒",
    color: "#FF8C00",
    available: true,
  },
  {
    id: 5,
    type: "Hospital",
    name: "Govt. Stanley Hospital",
    distance: "3.4 km",
    time: "11 min",
    phone: "044-25284761",
    address: "Old Jail Rd, Chennai",
    icon: "🏥",
    color: "#FF4757",
    available: true,
  },
];

const quickDials = [
  { label: "Ambulance", number: "108", icon: "🚑", color: "#FF6B35" },
  { label: "Police", number: "100", icon: "🚔", color: "#1E90FF" },
  { label: "Fire", number: "101", icon: "🔥", color: "#FF4500" },
  { label: "Highway", number: "1033", icon: "🛣️", color: "#2ED573" },
];

function PanicButton({ onActivate }) {
  const [pressing, setPressing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activated, setActivated] = useState(false);
  const intervalRef = useRef(null);

  const startPress = () => {
    setPressing(true);
    intervalRef.current = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(intervalRef.current);
          setActivated(true);
          onActivate();
          return 100;
        }
        return p + 5;
      });
    }, 50);
  };

  const stopPress = () => {
    if (!activated) {
      setPressing(false);
      setProgress(0);
      clearInterval(intervalRef.current);
    }
  };

  const reset = () => {
    setActivated(false);
    setPressing(false);
    setProgress(0);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
      <div
        onMouseDown={startPress}
        onMouseUp={stopPress}
        onMouseLeave={stopPress}
        onTouchStart={startPress}
        onTouchEnd={stopPress}
        onClick={activated ? reset : undefined}
        style={{
          position: "relative",
          width: "160px",
          height: "160px",
          borderRadius: "50%",
          cursor: "pointer",
          userSelect: "none",
        }}
      >
        {/* Pulse rings */}
        {activated && (
          <>
            <div style={{
              position: "absolute", inset: "-20px", borderRadius: "50%",
              border: "2px solid rgba(255,71,87,0.4)",
              animation: "pulseRing 1.5s ease-out infinite",
            }} />
            <div style={{
              position: "absolute", inset: "-40px", borderRadius: "50%",
              border: "2px solid rgba(255,71,87,0.2)",
              animation: "pulseRing 1.5s ease-out infinite 0.5s",
            }} />
          </>
        )}

        {/* Circular progress */}
        <svg style={{ position: "absolute", inset: 0, transform: "rotate(-90deg)" }} width="160" height="160">
          <circle cx="80" cy="80" r="72" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="6" />
          <circle
            cx="80" cy="80" r="72" fill="none"
            stroke={activated ? "#FF4757" : "#FF6B35"}
            strokeWidth="6"
            strokeDasharray={`${2 * Math.PI * 72}`}
            strokeDashoffset={`${2 * Math.PI * 72 * (1 - progress / 100)}`}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 0.05s linear" }}
          />
        </svg>

        {/* Button core */}
        <div style={{
          position: "absolute", inset: "12px", borderRadius: "50%",
          background: activated
            ? "linear-gradient(135deg, #FF4757, #C0392B)"
            : pressing
            ? "linear-gradient(135deg, #FF6B35, #FF4757)"
            : "linear-gradient(135deg, #2D2D2D, #1A1A1A)",
          boxShadow: activated
            ? "0 0 40px rgba(255,71,87,0.8), inset 0 2px 4px rgba(255,255,255,0.1)"
            : pressing
            ? "0 0 20px rgba(255,107,53,0.5), inset 0 2px 4px rgba(255,255,255,0.1)"
            : "0 8px 32px rgba(0,0,0,0.5), inset 0 2px 4px rgba(255,255,255,0.05)",
          display: "flex", flexDirection: "column", alignItems: "center",
          justifyContent: "center", gap: "4px",
          transition: "all 0.2s ease",
          transform: pressing ? "scale(0.97)" : "scale(1)",
        }}>
          <span style={{ fontSize: "32px" }}>{activated ? "📡" : "🆘"}</span>
          <span style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: activated ? "13px" : "15px",
            color: activated ? "#FF8A8A" : "#fff",
            letterSpacing: "2px",
          }}>
            {activated ? "CALLING..." : pressing ? "HOLD..." : "PANIC"}
          </span>
        </div>
      </div>
      <p style={{
        color: "rgba(255,255,255,0.4)", fontSize: "11px", letterSpacing: "1px",
        fontFamily: "monospace", textAlign: "center",
      }}>
        {activated ? "TAP TO CANCEL" : "HOLD 3 SECONDS TO ALERT"}
      </p>
    </div>
  );
}

function ServiceCard({ service, index }) {
  const [calling, setCalling] = useState(false);

  return (
    <div style={{
      background: "rgba(255,255,255,0.04)",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: "16px",
      padding: "16px",
      display: "flex",
      alignItems: "center",
      gap: "14px",
      animation: `slideIn 0.4s ease ${index * 0.08}s both`,
      cursor: "pointer",
      transition: "all 0.2s ease",
    }}
    onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.07)"}
    onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.04)"}
    >
      <div style={{
        width: "48px", height: "48px", borderRadius: "12px",
        background: `${service.color}22`,
        border: `1px solid ${service.color}44`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "22px", flexShrink: 0,
      }}>
        {service.icon}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "2px" }}>
          <span style={{
            fontFamily: "'Bebas Neue', sans-serif", fontSize: "15px",
            color: "#fff", letterSpacing: "1px",
          }}>{service.name}</span>
        </div>
        <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "11px", marginBottom: "4px" }}>
          {service.address}
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <span style={{ color: service.color, fontSize: "11px", fontWeight: "600" }}>
            📍 {service.distance}
          </span>
          <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "11px" }}>
            ⏱ {service.time} away
          </span>
        </div>
      </div>

      <button
        onClick={() => setCalling(true)}
        style={{
          background: calling ? "#2ED573" : service.color,
          border: "none", borderRadius: "10px",
          padding: "8px 14px",
          color: "#fff", fontSize: "12px", fontWeight: "700",
          cursor: "pointer", flexShrink: 0,
          letterSpacing: "0.5px",
          transition: "all 0.2s ease",
          boxShadow: `0 4px 12px ${service.color}44`,
        }}
      >
        {calling ? "✓ Called" : `📞 ${service.phone}`}
      </button>
    </div>
  );
}

export default function RoadSoS() {
  const [tab, setTab] = useState("home");
  const [filter, setFilter] = useState("All");
  const [panicActivated, setPanicActivated] = useState(false);
  const [locationStatus, setLocationStatus] = useState("Locating...");
  const [shareStatus, setShareStatus] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => setLocationStatus("Anna Salai, Chennai · GPS Active"), 1500);
    return () => clearTimeout(timer);
  }, []);

  const filters = ["All", "Hospital", "Ambulance", "Police", "Fire & Rescue"];
  const filtered = filter === "All" ? emergencyServices : emergencyServices.filter(s => s.type === filter);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0D0D0D",
      color: "#fff",
      fontFamily: "'DM Sans', sans-serif",
      maxWidth: "420px",
      margin: "0 auto",
      position: "relative",
      overflow: "hidden",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        @keyframes pulseRing {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(1.4); opacity: 0; }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        ::-webkit-scrollbar { width: 0; }
      `}</style>

      {/* Background glow */}
      <div style={{
        position: "fixed", top: "-100px", left: "50%", transform: "translateX(-50%)",
        width: "300px", height: "300px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(255,71,87,0.12) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* Header */}
      <div style={{
        padding: "52px 20px 16px",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
              <span style={{ fontSize: "22px" }}>🆘</span>
              <span style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "28px", letterSpacing: "3px",
                background: "linear-gradient(90deg, #FF4757, #FF8A8A)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>RoadSoS</span>
            </div>
            <div style={{
              display: "flex", alignItems: "center", gap: "6px",
              color: "rgba(255,255,255,0.4)", fontSize: "11px",
            }}>
              <span style={{
                width: "6px", height: "6px", borderRadius: "50%",
                background: "#2ED573",
                animation: "blink 2s ease infinite",
                display: "inline-block",
              }} />
              {locationStatus}
            </div>
          </div>
          <div style={{
            background: "rgba(255,71,87,0.15)", border: "1px solid rgba(255,71,87,0.3)",
            borderRadius: "10px", padding: "6px 12px",
            fontSize: "11px", color: "#FF4757", fontWeight: "600", letterSpacing: "1px",
          }}>
            LIVE
          </div>
        </div>
      </div>

      {/* Panic activated banner */}
      {panicActivated && (
        <div style={{
          background: "linear-gradient(90deg, #FF4757, #C0392B)",
          padding: "12px 20px",
          display: "flex", alignItems: "center", gap: "10px",
          animation: "slideIn 0.3s ease",
        }}>
          <span style={{ fontSize: "18px", animation: "blink 1s ease infinite" }}>📡</span>
          <div>
            <div style={{ fontWeight: "700", fontSize: "13px", letterSpacing: "0.5px" }}>
              EMERGENCY ALERT SENT
            </div>
            <div style={{ fontSize: "11px", opacity: 0.8 }}>
              Your location is being shared with emergency services
            </div>
          </div>
        </div>
      )}

      <div style={{ padding: "0 20px 100px", overflowY: "auto" }}>

        {tab === "home" && (
          <>
            {/* Panic Button */}
            <div style={{
              margin: "28px 0",
              display: "flex", flexDirection: "column", alignItems: "center",
              gap: "8px",
            }}>
              <PanicButton onActivate={() => setPanicActivated(true)} />
            </div>

            {/* Quick Dials */}
            <div style={{ marginBottom: "24px" }}>
              <p style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "14px", letterSpacing: "2px",
                color: "rgba(255,255,255,0.4)", marginBottom: "12px",
              }}>QUICK DIAL</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                {quickDials.map((q) => (
                  <button key={q.number} style={{
                    background: `${q.color}18`,
                    border: `1px solid ${q.color}33`,
                    borderRadius: "14px", padding: "14px",
                    display: "flex", alignItems: "center", gap: "10px",
                    cursor: "pointer", color: "#fff",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = `${q.color}30`}
                  onMouseLeave={e => e.currentTarget.style.background = `${q.color}18`}
                  >
                    <span style={{ fontSize: "20px" }}>{q.icon}</span>
                    <div style={{ textAlign: "left" }}>
                      <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>{q.label}</div>
                      <div style={{
                        fontFamily: "'Bebas Neue', sans-serif",
                        fontSize: "20px", letterSpacing: "1px", color: q.color,
                      }}>{q.number}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Share Location */}
            <button
              onClick={() => setShareStatus("Sharing location...")}
              style={{
                width: "100%", padding: "14px",
                background: "rgba(46,213,115,0.1)",
                border: "1px solid rgba(46,213,115,0.3)",
                borderRadius: "14px", color: "#2ED573",
                fontSize: "14px", fontWeight: "600", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                letterSpacing: "0.5px", marginBottom: "24px",
              }}
            >
              📍 {shareStatus || "Share My Location"}
            </button>
          </>
        )}

        {tab === "nearby" && (
          <>
            <div style={{ paddingTop: "20px", marginBottom: "16px" }}>
              <p style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "14px", letterSpacing: "2px",
                color: "rgba(255,255,255,0.4)", marginBottom: "12px",
              }}>FILTER BY TYPE</p>
              <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "4px" }}>
                {filters.map((f) => (
                  <button key={f} onClick={() => setFilter(f)} style={{
                    background: filter === f ? "#FF4757" : "rgba(255,255,255,0.06)",
                    border: `1px solid ${filter === f ? "#FF4757" : "rgba(255,255,255,0.1)"}`,
                    borderRadius: "20px", padding: "6px 14px",
                    color: filter === f ? "#fff" : "rgba(255,255,255,0.5)",
                    fontSize: "12px", fontWeight: "600", cursor: "pointer",
                    whiteSpace: "nowrap", letterSpacing: "0.5px",
                    transition: "all 0.2s ease",
                  }}>
                    {f}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {filtered.map((s, i) => <ServiceCard key={s.id} service={s} index={i} />)}
            </div>
          </>
        )}

        {tab === "info" && (
          <div style={{ paddingTop: "24px" }}>
            {[
              { emoji: "🚗", title: "Road Accident", steps: ["Move to safety if possible", "Call 108 for ambulance", "Don't move injured persons", "Keep road clear for emergency vehicles"] },
              { emoji: "🔥", title: "Vehicle Fire", steps: ["Exit vehicle immediately", "Move 100m away", "Call 101 for fire rescue", "Never open hood if on fire"] },
              { emoji: "⚡", title: "Medical Emergency", steps: ["Keep person calm and still", "Call 108 immediately", "Don't give food or water", "Monitor breathing until help arrives"] },
            ].map((guide, i) => (
              <div key={i} style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: "16px", padding: "16px", marginBottom: "12px",
                animation: `slideIn 0.4s ease ${i * 0.1}s both`,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                  <span style={{ fontSize: "24px" }}>{guide.emoji}</span>
                  <span style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: "18px", letterSpacing: "1.5px",
                  }}>{guide.title}</span>
                </div>
                {guide.steps.map((step, j) => (
                  <div key={j} style={{
                    display: "flex", gap: "10px", marginBottom: "8px",
                    color: "rgba(255,255,255,0.65)", fontSize: "13px", lineHeight: "1.5",
                  }}>
                    <span style={{
                      background: "#FF475722", color: "#FF4757",
                      borderRadius: "50%", width: "20px", height: "20px",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "10px", fontWeight: "700", flexShrink: 0,
                    }}>{j + 1}</span>
                    {step}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div style={{
        position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
        width: "100%", maxWidth: "420px",
        background: "rgba(13,13,13,0.95)",
        backdropFilter: "blur(20px)",
        borderTop: "1px solid rgba(255,255,255,0.08)",
        display: "flex", justifyContent: "space-around",
        padding: "12px 0 20px",
      }}>
        {[
          { id: "home", icon: "🆘", label: "SOS" },
          { id: "nearby", icon: "📍", label: "Nearby" },
          { id: "info", icon: "📋", label: "First Aid" },
        ].map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            background: "none", border: "none", cursor: "pointer",
            display: "flex", flexDirection: "column", alignItems: "center", gap: "4px",
            color: tab === t.id ? "#FF4757" : "rgba(255,255,255,0.35)",
            transition: "all 0.2s ease",
            transform: tab === t.id ? "scale(1.1)" : "scale(1)",
          }}>
            <span style={{ fontSize: "22px" }}>{t.icon}</span>
            <span style={{
              fontSize: "10px", fontWeight: "700", letterSpacing: "1px",
              fontFamily: "'Bebas Neue', sans-serif",
            }}>{t.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
