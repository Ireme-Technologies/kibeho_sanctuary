const DEFAULT_OVERLAY =
  'linear-gradient(120deg, rgba(18, 40, 71, 0.9), rgba(26, 54, 93, 0.55))'

export function heroBackgroundStyle(image, overlay = DEFAULT_OVERLAY) {
  return {
    backgroundImage: image ? `${overlay}, url(${image})` : overlay,
  }
}
