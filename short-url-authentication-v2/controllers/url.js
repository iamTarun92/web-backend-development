const URL = require('../models/url')

async function handelGenerateShortUrl(req, res) {
  const { longUrl } = req.body

  if (!longUrl) {
    return res.status(400).json({ error: 'URL is required' })
  }

  // URL validation (using a simple regex for demonstration)
  const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/
  if (!urlRegex.test(longUrl)) {
    return res.status(400).json({ error: 'Invalid URL format' })
  }

  try {
    const existingEntry = await URL.findOne({ redirectUrl: longUrl })

    if (existingEntry) {
      return res.status(200).json({
        shortUrl: existingEntry.shortUrl,
        error: 'URL already exists.',
      })
    }

    // Dynamically import nanoid
    const { nanoid } = await import('nanoid')
    const shortId = nanoid(10)
    const shortUrl = `${req.protocol}://${req.get('host')}/url/${shortId}`

    const entry = new URL({
      shortId,
      shortUrl,
      redirectUrl: longUrl,
      visitHistory: [],
      createdBy: req.user._id,
    })

    await entry.save()
    return res.redirect('/url')
  } catch (err) {
    return res.status(400).json({ error: 'Unable to add this url.' })
  }
}

async function handelGetAllUrl(req, res) {
  const allURL = await URL.find({ createdBy: req.user._id })
  res.render('urls', { allURL })
}

async function handelRedirectShortUrl(req, res) {
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
      return res.status(404).json({ message: 'URL not found.' })
    }

    return res.redirect(entry.redirectUrl)
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Internal Server Error', error: error.message })
  }
}

async function handelGetAnalytics(req, res) {
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
