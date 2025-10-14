const SDK = {
  version: SDK_VERSION,
  init(options = {}) {
    console.log(`MyApp SDK v${__SDK_VERSION__} initialized`, options)
  }
}

export default SDK