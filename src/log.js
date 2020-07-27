export default function log(...args) {
  if (process.env.NODE_ENV !== "production") {
    console.log(JSON.stringify(...args));
  }
}
