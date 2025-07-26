
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
    
    // Create or reuse shared SVG
    this.svg = this.getOrCreateSVG(this.container);

    this.createSliderGroup();
  }

  getOrCreateSVG(container) {
    let svg = container.querySelector("svg");
    if (!svg) {
      svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      const rect = container.getBoundingClientRect();
      const size = Math.min(rect.width, rect.height) || 320;
      svg.setAttribute("viewBox", `0 0 ${size} ${size}`);
      svg.setAttribute("width", "100%");
      svg.setAttribute("height", "100%");

      container.appendChild(svg);
    } else {
      const rect = container.getBoundingClientRect();
      const size = Math.min(rect.width, rect.height) || 320;
      svg.setAttribute("viewBox", `0 0 ${size} ${size}`);
    }
    return svg;
  }

  createSliderGroup() {
    const svgNS = "http://www.w3.org/2000/svg";
    const containerRect = this.container.getBoundingClientRect();
    const size = Math.min(containerRect.width, containerRect.height);
    const cx = size / 2;
    const cy = size / 2;
    this.center = { x: cx, y: cy };

    this.group = document.createElementNS(svgNS, "g");
    this.svg.appendChild(this.group);

    this.track = document.createElementNS(svgNS, "path");
    this.track.setAttribute("fill", "none");
    this.track.setAttribute("stroke", "#ddd");
    this.track.setAttribute("stroke-width", 10);
    this.svg.appendChild(this.track);

    this.arc = document.createElementNS(svgNS, "path");
    this.arc.setAttribute("fill", "none");
    this.arc.setAttribute("stroke", this.color);
    this.arc.setAttribute("stroke-width", 20);
    this.arc.setAttribute("stroke-opacity", "0.7");
    this.group.appendChild(this.arc);

    this.handle = document.createElementNS(svgNS, "circle");
    this.handle.setAttribute("r", 16);
    this.handle.setAttribute("fill", this.color);
    this.handle.classList.add("handle");
    this.group.appendChild(this.handle);

    this.updateHandlePosition(this.value);

    this.handle.addEventListener("mousedown", (e) => this.startDrag(e));
    this.handle.addEventListener("touchstart", (e) => this.startDrag(e), { passive: false });
    this.track.addEventListener("click", (e) => this.handleClick(e));
    this.arc.addEventListener("click", (e) => this.handleClick(e));
  }

  startDrag(e) {
    e.preventDefault();
    this.dragging = true;
    window.addEventListener("mousemove", this.onDrag);
    window.addEventListener("mouseup", this.stopDrag);
    window.addEventListener("touchmove", this.onDrag, { passive: false });
    window.addEventListener("touchend", this.stopDrag);
  }

  onDrag = (e) => {
    if (!this.dragging) return;
    e.preventDefault();

    let clientX, clientY;
    if (e.touches && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const rect = this.svg.getBoundingClientRect();
    const dx = clientX - (rect.left + this.center.x);
    const dy = clientY - (rect.top + this.center.y);

    let angle = Math.atan2(dy, dx);
    let angleDeg = angle * (180 / Math.PI);
    if (angleDeg < 0) angleDeg += 360;
    this.angle = (angleDeg * Math.PI) / 180;

    const value = this.angleToValue(this.angle);
    this.value = value;
    this.updateHandlePosition(value);
  };

  stopDrag = () => {
    this.dragging = false;
    window.removeEventListener("mousemove", this.onDrag);
    window.removeEventListener("mouseup", this.stopDrag);
    window.removeEventListener("touchmove", this.onDrag);
    window.removeEventListener("touchend", this.stopDrag);
  };

  handleClick(e) {
    this.angle = this.getAngleFromEvent(e);
    this.value = this.angleToValue(this.angle);
    this.updateHandlePosition(this.value);
  }

  updateHandlePosition(value) {
    const angle = ((value - this.min) / (this.max - this.min)) * 2 * Math.PI;
    const adjustedAngle = angle - (Math.PI / 2);
    const x = this.center.x + (this.radius * Math.cos(adjustedAngle));
    const y = this.center.y + (this.radius * Math.sin(adjustedAngle));
    this.handle.setAttribute("cx", x);
    this.handle.setAttribute("cy", y);
    this.updateArc(value);
  }

  updateArc(value) {
    const startAngle = 0;
    const endAngle = ((value - this.min) / (this.max - this.min)) * 360;
    const r = this.radius;
    const cx = this.center.x;
    const cy = this.center.y;

    const start = this.polarToCartesian(cx, cy, r, endAngle);
    const end = this.polarToCartesian(cx, cy, r, startAngle);
    const largeArc = endAngle - startAngle > 180 ? 1 : 0;

    const arcPath = [
      "M", end.x, end.y,
      "A", r, r, 0, largeArc, 1, start.x, start.y
    ].join(" ");

    this.arc.setAttribute("d", arcPath);
  }

  getAngleFromEvent(e) {
    const { clientX, clientY } = e.touches ? e.touches[0] : e;
    const rect = this.container.getBoundingClientRect();
    const x = clientX - rect.left - this.center.x;
    const y = clientY - rect.top - this.center.y;
    return Math.atan2(y, x);
  }

  angleToValue(angle) {
    const degrees = (angle * 180) / Math.PI;
    const normalized = (degrees + 360 + 90) % 360;
    const range = this.max - this.min;
    const raw = (normalized / 360) * range + this.min;
    return Math.round(raw / this.step) * this.step;
  }

  polarToCartesian(cx, cy, r, angleInDegrees) {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
      x: cx + (r * Math.cos(angleInRadians)),
      y: cy + (r * Math.sin(angleInRadians)),
    };
  }
}
