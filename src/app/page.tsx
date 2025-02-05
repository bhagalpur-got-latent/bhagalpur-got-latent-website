"use client";
import { useEffect } from "react";
import { fira_sans, lobster_two } from "@/utils/fonts";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const getToRegisterPage = () => {
    router.push("/register");
  };

  const getToGuidelinesPage = () => {
    router.push("/guidelines");
  };

  useEffect(() => {
    const PI2 = Math.PI * 2;
    const random = (min: number, max: number) =>
      (Math.random() * (max - min + 1) + min) | 0;
    const timestamp = () => new Date().getTime();

    class Birthday {
      fireworks: any[];
      counter: number;
      width: number;
      height: number;
      spawnA: number;
      spawnB: number;
      spawnC: number;
      spawnD: number = 0;

      constructor() {
        this.resize();
        this.fireworks = [];
        this.counter = 0;
        this.width = canvas.width = window.innerWidth;
        let center = (this.width / 2) | 0;
        this.spawnA = (center - center / 4) | 0;
        this.spawnB = (center + center / 4) | 0;

        this.height = canvas.height = window.innerHeight;
        this.spawnC = this.height * 0.1;
        this.spawnD = this.height * 0.5;
      }

      resize() {
        this.width = canvas.width = window.innerWidth;
        let center = (this.width / 2) | 0;
        this.spawnA = (center - center / 4) | 0;
        this.spawnB = (center + center / 4) | 0;

        this.height = canvas.height = window.innerHeight;
        this.spawnC = this.height * 0.1;
        this.spawnD = this.height * 0.5;
      }

      onClick(evt: MouseEvent | TouchEvent) {
        let x =
          (evt as MouseEvent).clientX || (evt as TouchEvent).touches?.[0].pageX;
        let y =
          (evt as MouseEvent).clientY || (evt as TouchEvent).touches?.[0].pageY;

        let count = random(3, 5);
        for (let i = 0; i < count; i++) {
          this.fireworks.push(
            new Firework(
              random(this.spawnA, this.spawnB),
              this.height,
              x,
              y,
              random(0, 260),
              random(30, 110)
            )
          );
        }

        this.counter = -1;
      }

      update(delta: number) {
        ctx.globalCompositeOperation = "hard-light";
        ctx.fillStyle = `rgba(20,20,20,${7 * delta})`;
        ctx.fillRect(0, 0, this.width, this.height);

        ctx.globalCompositeOperation = "lighter";
        for (let firework of this.fireworks) firework.update(delta);

        this.counter += delta * 3;
        if (this.counter >= 1) {
          this.fireworks.push(
            new Firework(
              random(this.spawnA, this.spawnB),
              this.height,
              random(0, this.width),
              random(this.spawnC, this.spawnD),
              random(0, 360),
              random(30, 110)
            )
          );
          this.counter = 0;
        }

        if (this.fireworks.length > 1000)
          this.fireworks = this.fireworks.filter((firework) => !firework.dead);
      }
    }

    class Firework {
      x: number;
      y: number;
      targetX: number;
      targetY: number;
      shade: number;
      offsprings: number;
      dead: boolean;
      history: Array<{ x: number; y: number }>;
      madeChilds: boolean = false; // Initialize here

      constructor(
        x: number,
        y: number,
        targetX: number,
        targetY: number,
        shade: number,
        offsprings: number
      ) {
        this.dead = false;
        this.offsprings = offsprings;
        this.x = x;
        this.y = y;
        this.targetX = targetX;
        this.targetY = targetY;
        this.shade = shade;
        this.history = [];
      }

      update(delta: number) {
        if (this.dead) return;

        let xDiff = this.targetX - this.x;
        let yDiff = this.targetY - this.y;
        if (Math.abs(xDiff) > 3 || Math.abs(yDiff) > 3) {
          this.x += xDiff * 2 * delta;
          this.y += yDiff * 2 * delta;

          this.history.push({
            x: this.x,
            y: this.y,
          });

          if (this.history.length > 20) this.history.shift();
        } else {
          if (this.offsprings && !this.madeChilds) {
            let babies = this.offsprings / 2;
            for (let i = 0; i < babies; i++) {
              let targetX =
                (this.x + this.offsprings * Math.cos((PI2 * i) / babies)) | 0;
              let targetY =
                (this.y + this.offsprings * Math.sin((PI2 * i) / babies)) | 0;

              birthday.fireworks.push(
                new Firework(this.x, this.y, targetX, targetY, this.shade, 0)
              );
            }
          }
          this.madeChilds = true;
          this.history.shift();
        }

        if (this.history.length === 0) this.dead = true;
        else if (this.offsprings) {
          for (let i = 0; this.history.length > i; i++) {
            let point = this.history[i];
            ctx.beginPath();
            ctx.fillStyle = "hsl(" + this.shade + ",100%," + i + "%)";
            ctx.arc(point.x, point.y, 1, 0, PI2, false);
            ctx.fill();
          }
        } else {
          ctx.beginPath();
          ctx.fillStyle = "hsl(" + this.shade + ",100%,50%)";
          ctx.arc(this.x, this.y, 1, 0, PI2, false);
          ctx.fill();
        }
      }
    }

    let canvas = document.getElementById("birthday") as HTMLCanvasElement;
    let ctx = canvas.getContext("2d")!;

    let then = timestamp();
    let birthday = new Birthday();
    window.onresize = () => birthday.resize();
    document.onclick = (evt) => birthday.onClick(evt);
    document.ontouchstart = (evt) => birthday.onClick(evt);

    (function loop() {
      requestAnimationFrame(loop);

      let now = timestamp();
      let delta = now - then;

      then = now;
      birthday.update(delta / 1000);
    })();
  }, []);

  return (
    <div className="relative flex sm:flex-col items-center justify-center w-screen h-screen bg-black">
      {/* Canvas for Animation */}
      <canvas
        id="birthday"
        className="absolute top-0 left-0 w-full h-full"
      ></canvas>

      {/* Title Text */}
      <div className=" absolute flex flex-col gap-5 top-20 sm:top-5 justify-center ">
        <Image
          src="/BhagalpurGotLatent-3.png" // Path to the image in your public folder
          alt="Bhagalpur Got Latent"
          width={350}
          height={350}
          className="rounded-3xl"
        />
        {/* <div className="text-center">
          <h1
            className={`${lobster_two.className} text-white text-5xl sm:text-8xl`}
          >
            Bhagalpur's
          </h1>
          <h1
            className={`${lobster_two.className} text-white text-5xl sm:text-8xl`}
          >
            Got
          </h1>
          <h1
            className={`${lobster_two.className} text-white text-5xl sm:text-8xl`}
          >
            Latent
          </h1>
        </div> */}

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row sm:justify-center sm:gap-4 ">
          <button
            onClick={getToRegisterPage}
            className={`${fira_sans.className} mb-2 sm:mb-0 px-8 py-4 text-lg sm:text-xl font-semibold text-white bg-gradient-to-r from-blue-400 to-blue-600 rounded-full shadow-xl hover:from-blue-500 hover:to-blue-700 transition-all duration-300 transform hover:scale-105`}
          >
            Register Now
          </button>

          <button
            onClick={getToGuidelinesPage}
            className={`${fira_sans.className} sm:mb-0 mb-2 px-8 py-4 text-lg sm:text-xl font-semibold text-white bg-gradient-to-r from-blue-400 to-blue-600 rounded-full shadow-xl hover:from-blue-500 hover:to-blue-700 transition-all duration-300 transform hover:scale-105`}
          >
            Guidelines
          </button>
        </div>
      </div>
    </div>
  );
}
