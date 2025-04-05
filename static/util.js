import { Time } from "https://js.sabae.cc/DateTime.js";

export const blob2bin = async (blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onloadend = () => {
      const arrayBuffer = reader.result;
      resolve(new Uint8Array(arrayBuffer));
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(blob);
  });
};

export const canvas2bin = async (canvas) => {
  return new Promise((resolve, reject) => {
    // canvasをJPEGのBlobでエクスポート
    canvas.toBlob(blob => {
      if (blob) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const arrayBuffer = reader.result;
          resolve(new Uint8Array(arrayBuffer));
        };
        reader.readAsArrayBuffer(blob);
      } else {
        reject();
      }
    }, "image/jpeg", 0.8); // 品質：0.0〜1.0
  });
};

export const jpeg2img = (jpeg) => {
  const blob = new Blob([jpeg], { type: "image/jpeg" });
  const imageUrl = URL.createObjectURL(blob);
  const img = document.createElement("img");
  img.src = imageUrl;
  return img;
};

export const eqaulsBin = (bin1, bin2) => {
  if (bin1 == bin2) return true;
  if (bin1 == null || bin2 == null) return false;
  if (bin1.length != bin2.length) return false;
  for (let i = 0; i < bin1.length; i++) {
    if (bin1[i] != bin2[i]) return false;
  }
  return true;
};

export const insertChild = (parent, c) => {
  if (parent.firstChild) {
    parent.insertBefore(c, parent.firstChild);
  } else {
    parent.appendChild(c);
  }
};

export const insertComment = (parent, data) => {
  if (typeof data.data != "string") return;
  const s = data.data;
  const div = document.createElement("div");
  const time = new Time().toStringSec();
  if (s.startsWith("https://") || s.startsWith("http://")) {
    div.textContent = data.id + " " + time + " > ";
    const a = document.createElement("a");
    a.setAttribute("href", s);
    a.setAttribute("target", "_blank");
    a.textContent = s;
    div.appendChild(a);
  } else {
    div.textContent = data.id + " " + time + " > " + s;
  }
  insertChild(parent, div);
};
