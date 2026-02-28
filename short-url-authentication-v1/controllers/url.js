const URL = require('../models/url')

const handelGenerateShortUrl = async (req, res) => {
  const { url } = req.body

  if (!url) {
    return res.status(400).json({ error: 'URL is required' })
  }

  // URL validation (using a simple regex for demonstration)
  const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/
  if (!urlRegex.test(url)) {
    return res.status(400).json({ error: 'Invalid URL format' })
  }

  try {
    const existingEntry = await URL.findOne({ redirectUrl: url })

    if (existingEntry) {
      return res.status(200).json({
        shortUrl: existingEntry.shortUrl,
        error: 'URL already exists.',
      })
    }

    const { nanoid } = await import('nanoid')
    const shortId = nanoid(10) // Generate a unique short ID of length 10
    const shortUrl = `${req.protocol}://${req.get('host')}/url/${shortId}`

    const newEntry = new URL({
      shortId,
      shortUrl,
      redirectUrl: url,
      visitHistory: [],
    })

    await newEntry.save()
    return res.redirect('/')
  } catch (err) {
    console.error('Error generating short URL:', err)
    return res.status(500).json({ error: 'Unable to add this url.' })
  }
}

const handelGetAllUrl = async (req, res) => {
  const allURL = await URL.find()
  res.render('index', { urls: allURL })
}

const handelRedirectShortUrl = async (req, res) => {
  try {
    const { shortId } = req.params

    const entry = await URL.findOneAndUpdate(
      { shortId },
      {
        $push: {
          visitHistory: { timestamps: Date.now() },
        },
      },
      { new: true }, // This option ensures the updated document is returned
    )

    if (!entry) {
      return res.status(404).json({ message: 'URL not found1.' })
    }

    return res.redirect(entry.redirectUrl)
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Internal Server Error', error: error.message })
  }
}

const handelGetAnalytics = async (req, res) => {
  try {
    const { shortId } = req.params
    const result = await URL.findOne({ shortId })

    if (!result) {
      return res.status(404).json({ message: 'URL not found2.' })
    }

    return res.status(201).json({
      analytics: result.visitHistory,
      totalClicks: result.visitHistory.length,
    })
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Internal Server Error', error: error.message })
  }
}

module.exports = {
  handelGenerateShortUrl,
  handelGetAllUrl,
  handelRedirectShortUrl,
  handelGetAnalytics,
}
