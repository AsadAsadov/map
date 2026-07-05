import Phaser from "phaser";
import BootScene from "./scenes/BootScene";
import PreloadScene from "./scenes/PreloadScene";
import CityScene from "./scenes/CityScene";
import "./style.css";

const config = {
  type: Phaser.AUTO,
  parent: "game",
  backgroundColor: "#07111f",
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: window.innerWidth,
    height: window.innerHeight,
  },
  scene: [BootScene, PreloadScene, CityScene],
};

new Phaser.Game(config);
