
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

  drawSlider() {
    const svgNS = "http://www.w3.org/2000/svg";
    const svgSize = 320;
    const cx = svgSize / 2;
    const cy = svgSize / 2;

    this.center = { x: cx, y: cy };

    this.svg = document.createElementNS(svgNS, "svg");
    this.svg.setAttribute("width", svgSize);
    this.svg.setAttribute("height", svgSize);
    this.svg.style.position = "absolute";
    this.container.appendChild(this.svg);


    this.track = document.createElementNS(svgNS, "path");
    this.track.setAttribute("fill", "none");
    this.track.setAttribute("stroke", "#ddd");
    this.track.setAttribute("stroke-width", 10);
    this.svg.appendChild(this.track);

    this.arc = document.createElementNS(svgNS, "path");
    this.arc.setAttribute("fill", "none");
    this.arc.setAttribute("stroke", this.color);
    this.arc.setAttribute("stroke-width", 10);
    this.svg.appendChild(this.arc);

    this.handle = document.createElementNS(svgNS, "circle");
    this.handle.setAttribute("r", 8);
    this.handle.setAttribute("fill", this.color);
    this.svg.appendChild(this.handle);
  }
}