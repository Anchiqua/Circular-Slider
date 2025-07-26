
class CircularSlider {
  constructor(options) {
    this.container = options.container;
    this.color = options.color || "#000";
    this.min = options.min || 0;
    this.max = options.max || 100;
    this.step = options.step || 1;
    this.radius = options.radius || 100;
    this.value = this.min;
    this.angle = -Math.PI / 2;
    this.drawSlider();
  }
}