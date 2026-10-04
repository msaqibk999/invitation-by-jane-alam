import { useEffect, useRef, useState } from "react";
import { CalendarPlus } from "lucide-react";
import { wedding } from "../data/wedding";

const HEART_PATH = `
  M50 96
  C50 96 6 70 6 36
  C6 18 20 6 32 6
  C42 6 48 14 50 24
  C52 14 58 6 68 6
  C80 6 94 18 94 36
  C94 70 50 96 50 96
  Z
`;

export function InvitationCard({
  onReveal,
}: {
  onReveal: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [isScratching, setIsScratching] = useState(false);
  const [revealed, setRevealed] = useState(false);

  /*
   * -------------------------------------------------------
   * GOOGLE CALENDAR
   * -------------------------------------------------------
   */

  const save = () => {
    const start = "20261231T103000";
    const end = "20261231T130000";

    window.open(
      `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${wedding.groom.name}%20%26%20${wedding.bride.name}%20Wedding&dates=${start}/${end}&location=${encodeURIComponent(
        wedding.venue.name + ", " + wedding.venue.address
      )}`,
      "_blank"
    );
  };

  /*
   * -------------------------------------------------------
   * CANVAS
   * -------------------------------------------------------
   */

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;

    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d", {
      willReadFrequently: true,
    });

    if (!ctx) return;

    const drawScratchLayer = (
      ctx: CanvasRenderingContext2D,
      width: number,
      height: number
    ) => {
      ctx.clearRect(0, 0, width, height);

      /*
       * Exact same heart shape as SVG
       */

      const heartPath = new Path2D();

      heartPath.moveTo(
        width * 0.5,
        height * 0.96
      );

      heartPath.bezierCurveTo(
        width * 0.5,
        height * 0.96,
        width * 0.06,
        height * 0.70,
        width * 0.06,
        height * 0.36
      );

      heartPath.bezierCurveTo(
        width * 0.06,
        height * 0.18,
        width * 0.20,
        height * 0.06,
        width * 0.32,
        height * 0.06
      );

      heartPath.bezierCurveTo(
        width * 0.42,
        height * 0.06,
        width * 0.48,
        height * 0.14,
        width * 0.50,
        height * 0.24
      );

      heartPath.bezierCurveTo(
        width * 0.52,
        height * 0.14,
        width * 0.58,
        height * 0.06,
        width * 0.68,
        height * 0.06
      );

      heartPath.bezierCurveTo(
        width * 0.80,
        height * 0.06,
        width * 0.94,
        height * 0.18,
        width * 0.94,
        height * 0.36
      );

      heartPath.bezierCurveTo(
        width * 0.94,
        height * 0.70,
        width * 0.50,
        height * 0.96,
        width * 0.50,
        height * 0.96
      );

      /*
       * Clip scratch layer to heart
       */

      ctx.save();

      ctx.clip(heartPath);

      /*
       * Scratch card gradient
       */

      const gradient = ctx.createLinearGradient(
        0,
        0,
        width,
        height
      );

      gradient.addColorStop(
        0,
        "#e4cec6"
      );

      gradient.addColorStop(
        0.45,
        "#f5e8e3"
      );

      gradient.addColorStop(
        1,
        "#d3b5aa"
      );

      ctx.fillStyle = gradient;

      ctx.fillRect(
        0,
        0,
        width,
        height
      );

      /*
       * Texture
       */

      ctx.fillStyle =
        "rgba(255,255,255,0.35)";

      for (
        let x = 0;
        x < width;
        x += 12
      ) {
        for (
          let y = 0;
          y < height;
          y += 12
        ) {
          ctx.beginPath();

          ctx.arc(
            x,
            y,
            1,
            0,
            Math.PI * 2
          );

          ctx.fill();
        }
      }

      /*
       * Scratch instruction
       */

      ctx.textAlign = "center";

      ctx.fillStyle =
        "rgba(145,70,82,0.85)";

      ctx.font =
        "italic 30px Georgia";

      ctx.fillText(
        "Scratch",
        width / 2,
        height * 0.45
      );

      ctx.font =
        "italic 21px Georgia";

      ctx.fillText(
        "to reveal our date",
        width / 2,
        height * 0.51
      );

      ctx.restore();

      /*
       * Heart border
       */

      ctx.save();

      ctx.strokeStyle =
        "rgba(125,71,54,0.75)";

      ctx.lineWidth = 2;

      ctx.stroke(heartPath);

      ctx.restore();
    };

    const resizeCanvas = () => {
      const rect =
        container.getBoundingClientRect();

      const dpr =
        window.devicePixelRatio || 1;

      canvas.width =
        rect.width * dpr;

      canvas.height =
        rect.height * dpr;

      canvas.style.width =
        `${rect.width}px`;

      canvas.style.height =
        `${rect.height}px`;

      ctx.setTransform(
        dpr,
        0,
        0,
        dpr,
        0,
        0
      );

      drawScratchLayer(
        ctx,
        rect.width,
        rect.height
      );
    };

    resizeCanvas();

    window.addEventListener(
      "resize",
      resizeCanvas
    );

    return () => {
      window.removeEventListener(
        "resize",
        resizeCanvas
      );
    };
  }, []);

  /*
   * -------------------------------------------------------
   * SCRATCH
   * -------------------------------------------------------
   */

  const scratch = (
    clientX: number,
    clientY: number
  ) => {
    const canvas = canvasRef.current;
    const container = containerRef.current;

    if (
      !canvas ||
      !container ||
      revealed
    ) {
      return;
    }

    const rect =
      container.getBoundingClientRect();

    const x =
      clientX - rect.left;

    const y =
      clientY - rect.top;

    /*
     * Don't scratch outside heart
     */

    if (
      !isPointInsideHeart(
        x / rect.width,
        y / rect.height
      )
    ) {
      return;
    }

    const ctx =
      canvas.getContext("2d");

    if (!ctx) return;

    ctx.globalCompositeOperation =
      "destination-out";

    /*
     * Bigger scratch brush for 420px heart
     */

    const radius = 25;

    ctx.beginPath();

    ctx.arc(
      x,
      y,
      radius,
      0,
      Math.PI * 2
    );

    ctx.fill();

    checkReveal(
      canvas,
      rect.width,
      rect.height
    );
  };

  /*
   * -------------------------------------------------------
   * HEART POINTER CHECK
   * -------------------------------------------------------
   */

  const isPointInsideHeart = (
    x: number,
    y: number
  ) => {
    const px = x * 100;
    const py = y * 100;

    if (
      py < 6 ||
      py > 96
    ) {
      return false;
    }

    if (
      py < 24 &&
      Math.abs(px - 50) < 3
    ) {
      return false;
    }

    return true;
  };

  /*
   * -------------------------------------------------------
   * 80% REVEAL
   * -------------------------------------------------------
   */

  const checkReveal = (
    canvas: HTMLCanvasElement,
    width: number,
    height: number
  ) => {
    const sampleCanvas =
      document.createElement(
        "canvas"
      );

    const sampleSize = 140;

    sampleCanvas.width =
      sampleSize;

    sampleCanvas.height =
      sampleSize;

    const sampleCtx =
      sampleCanvas.getContext("2d");

    if (!sampleCtx) return;

    sampleCtx.drawImage(
      canvas,
      0,
      0,
      sampleSize,
      sampleSize
    );

    const imageData =
      sampleCtx.getImageData(
        0,
        0,
        sampleSize,
        sampleSize
      );

    let heartPixels = 0;
    let scratchedPixels = 0;

    for (
      let y = 0;
      y < sampleSize;
      y++
    ) {
      for (
        let x = 0;
        x < sampleSize;
        x++
      ) {
        const nx =
          x / sampleSize;

        const ny =
          y / sampleSize;

        if (
          !isPointInsideHeart(
            nx,
            ny
          )
        ) {
          continue;
        }

        heartPixels++;

        const index =
          (y *
            sampleSize +
            x) *
          4;

        const alpha =
          imageData.data[
            index + 3
          ];

        if (alpha < 50) {
          scratchedPixels++;
        }
      }
    }

    const percentage =
      scratchedPixels /
      heartPixels;

    /*
     * IMPORTANT:
     * 80% required
     */

    if (percentage >= 0.60) {
      setRevealed(true);
      onReveal();

      canvas.style.transition =
        "opacity 1s ease";

      canvas.style.opacity = "0";

      setTimeout(() => {
        canvas.style.display =
          "none";
      }, 1000);
    }
  };

  /*
   * -------------------------------------------------------
   * MOUSE
   * -------------------------------------------------------
   */

  const handleMouseDown = (
    e: React.MouseEvent<HTMLCanvasElement>
  ) => {
    setIsScratching(true);

    scratch(
      e.clientX,
      e.clientY
    );
  };

  const handleMouseMove = (
    e: React.MouseEvent<HTMLCanvasElement>
  ) => {
    if (!isScratching) return;

    scratch(
      e.clientX,
      e.clientY
    );
  };

  const handleMouseUp = () => {
    setIsScratching(false);
  };

  /*
   * -------------------------------------------------------
   * TOUCH
   * -------------------------------------------------------
   */

  const handleTouchStart = (
    e: React.TouchEvent<HTMLCanvasElement>
  ) => {
    e.preventDefault();

    setIsScratching(true);

    const touch =
      e.touches[0];

    scratch(
      touch.clientX,
      touch.clientY
    );
  };

  const handleTouchMove = (
    e: React.TouchEvent<HTMLCanvasElement>
  ) => {
    e.preventDefault();

    if (!isScratching) return;

    const touch =
      e.touches[0];

    scratch(
      touch.clientX,
      touch.clientY
    );
  };

  const handleTouchEnd = () => {
    setIsScratching(false);
  };

  /*
   * =======================================================
   * UI
   * =======================================================
   */

  return (
    <section className="py-16 md:py-20 px-6 cream-bg text-center">

      <h2 className="font-calligraphy text-4xl md:text-8xl text-[var(--primary)]">
        Our forever begins
      </h2>

      {/* =================================================
          420 × 420 HEART
      ================================================= */}

      <div
        ref={containerRef}
        className="
          mx-auto
          mt-10
          relative
          w-[580px]
          h-[500px]
          max-w-full
        "
      >

        {/* =================================================
            SVG HEART + WEDDING CONTENT
        ================================================= */}

        <svg
          viewBox="0 0 100 100"
          className="
            absolute
            inset-0
            w-full
            h-full
            z-10
          "
          preserveAspectRatio="none"
        >

          <defs>

            <clipPath id="heartClip">

              <path
                d={HEART_PATH}
              />

            </clipPath>

            <radialGradient
              id="heartBackground"
              cx="50%"
              cy="45%"
              r="70%"
            >
              <stop
                offset="0%"
                stopColor="#fffaf8"
              />

              <stop
                offset="65%"
                stopColor="#f4e5df"
              />

              <stop
                offset="100%"
                stopColor="#dfc5bb"
              />
            </radialGradient>

          </defs>

          {/* ---------------------------------------------
              HEART BACKGROUND
          --------------------------------------------- */}

          <path
            d={HEART_PATH}
            fill="url(#heartBackground)"
          />

          {/* ---------------------------------------------
              CONTENT INSIDE HEART
          --------------------------------------------- */}

          <g clipPath="url(#heartClip)">

            {/* Small decorative line */}

            <text
              x="50"
              y="35"
              textAnchor="middle"
              fill="#8d533f"
              fontSize="3.5"
              letterSpacing="0.8"
            >
              YOU'RE INVITED
            </text>

            {/* Main heading */}

            <text
              x="50"
              y="46"
              textAnchor="middle"
              fill="#914652"
              fontSize="7"
              fontWeight="600"
              fontFamily="Georgia, serif"
            >
              {wedding.groom.name}
            </text>

            <text
              x="50"
              y="53"
              textAnchor="middle"
              fill="#914652"
              fontSize="4.5"
              fontFamily="Georgia, serif"
              fontStyle="italic"
            >
              &
            </text>

            <text
              x="50"
              y="61"
              textAnchor="middle"
              fill="#914652"
              fontSize="7"
              fontWeight="600"
              fontFamily="Georgia, serif"
            >
              {wedding.bride.name}
            </text>

            {/* Divider */}

            <line
              x1="35"
              y1="66"
              x2="65"
              y2="66"
              stroke="#8d533f"
              strokeWidth="0.5"
              opacity="0.6"
            />

            {/* DATE */}

            <text
              x="50"
              y="73"
              textAnchor="middle"
              fill="#6f4035"
              fontSize="5.5"
              fontWeight="bold"
              fontFamily="Georgia, serif"
            >
              {wedding.date}
            </text>

            {/* TIME */}

            <text
              x="50"
              y="79"
              textAnchor="middle"
              fill="#8d533f"
              fontSize="3.5"
              fontFamily="Georgia, serif"
            >
              {wedding.time}
            </text>

          </g>

          {/* ---------------------------------------------
              HEART BORDER
          --------------------------------------------- */}

          <path
            d={HEART_PATH}
            fill="none"
            stroke="hsl(15, 40%, 40%)"
            strokeWidth="0.8"
            vectorEffect="non-scaling-stroke"
            opacity="0.75"
          />

        </svg>

        {/* =================================================
            420 × 420 SCRATCH CANVAS
        ================================================= */}

        <canvas
          ref={canvasRef}
          className="
            absolute
            inset-0
            w-full
            h-full
            z-20
            cursor-pointer
            touch-none
          "
          onMouseDown={
            handleMouseDown
          }
          onMouseMove={
            handleMouseMove
          }
          onMouseUp={
            handleMouseUp
          }
          onMouseLeave={
            handleMouseUp
          }
          onTouchStart={
            handleTouchStart
          }
          onTouchMove={
            handleTouchMove
          }
          onTouchEnd={
            handleTouchEnd
          }
        />

      </div>

      {/* =================================================
          MESSAGE AFTER SCRATCH
      ================================================= */}

      <div
        className={`
          mt-7
          transition-all
          duration-1000
          ${
            revealed
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4"
          }
        `}
      >

        <p className="
          font-calligraphy
          text-6xl
          text-[#914652]
          mt-8
        ">
          Our Special Day ❤️
        </p>

      </div>

      {/* =================================================
          CALENDAR BUTTON
      ================================================= */}

    <button
      onClick={save}
      className={`
        mt-12
        inline-flex
        items-center
        gap-2
        rounded-full
        px-12
        py-6
        text-xs
        md:text-3xl
        font-semibold
        uppercase
        tracking-[.18em]
        bg-[var(--primary)]
        text-white
        shadow-gold

        transition-all
        duration-[1800ms]
        ease-[cubic-bezier(0.22,1,0.36,1)]

        ${
          revealed
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-6 scale-[0.96] pointer-events-none"
        }
      `}
    >
      <CalendarPlus size={32} />
      Save the Date
    </button>

    </section>
  );
}