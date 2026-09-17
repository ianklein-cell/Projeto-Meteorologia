import { useState, useEffect } from "react";

export default function BloodMoon() {
  const [isBloodMoon, setIsBloodMoon] = useState(() => {
    const estadoSalvo = localStorage.getItem("bloodMoon");
    return estadoSalvo === "true";
  });

  useEffect(() => {
    localStorage.setItem("bloodMoon", isBloodMoon);
    if (isBloodMoon) {
      document.body.style.backgroundColor = "#4a0e17";
      document.body.style.color = "#ffffff";
      document.body.style.transition = "background-color 0.5s ease, color 0.5s ease";
    } else {
      document.body.style.backgroundColor = "";
      document.body.style.color = "";
    }

    return () => {
      document.body.style.backgroundColor = "";
      document.body.style.color = "";
    };
  }, [isBloodMoon]);

  return (
    <button
      onClick={() => setIsBloodMoon(!isBloodMoon)}
      title={isBloodMoon ? "Desativar Blood Moon" : "Ativar Blood Moon"}
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        fontSize: "2.2rem",
        background: "transparent",
        border: "none",
        cursor: "pointer",
        zIndex: 9999,
        filter: isBloodMoon ? "drop-shadow(0 0 12px #ff4d4d)" : "none",
        transition: "transform 0.2s ease, filter 0.3s ease",
      }}
    >
      {isBloodMoon ? "🩸" : "🌙"}
    </button>
  );
}