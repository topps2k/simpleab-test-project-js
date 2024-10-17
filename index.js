const express = require('express');
const { SimpleABSDK, BaseAPIUrls, AggregationTypes, Treatments, Stages, Segment } = require('simpleab-sdk-js');
const path = require('path');

// Initialize the SDK
const simpleab = new SimpleABSDK(BaseAPIUrls.CAPTCHIFY_NA, '<your-api-key>', ['<your-experiment>']);

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Function to generate random string
function generateRandomString(length)
{
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++)
  {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

// GET endpoint to serve the HTML content
app.get('/', (req, res) =>
{
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// GET endpoint to get button details
app.get('/button-details', async (req, res) =>
{
  const startTime = Date.now(); // Start timestamp
  try
  {
    const experimentId = '<your-experiment>';
    const stage = Stages.PROD;
    const allocationKey = generateRandomString(10);
    const segment = await simpleab.getSegment();
    const treatment = await simpleab.getTreatmentWithSegment(experimentId, stage, segment, allocationKey);
    //const treatment = await simpleab.getTreatment(experimentId, stage, 'demo-custom', allocationKey);

    let buttonText = 'Click me';
    if (treatment === 'T1')
    {
      buttonText += ' - A';
    } else if (treatment === 'T2')
    {
      buttonText += ' - B';
    } else if (treatment === 'T3')
    {
      buttonText += ' - C';
    }

    // Simulate a 50ms delay for T1 treatment
    if (treatment === 'T1')
    {
      await new Promise(resolve => setTimeout(resolve, 50));
    } else if (treatment === 'C')
    {
      await new Promise(resolve => setTimeout(resolve, 25));
    } else if (treatment === 'T2')
    {
      await new Promise(resolve => setTimeout(resolve, 75));
    }

    const endTime = Date.now(); // End timestamp
    const latency = endTime - startTime; // Calculate latency

    // Track latency metric
    /*await simpleab.trackMetricWithSegment({
      experimentID: experimentId,
      stage: stage,
      segment: segment,
      treatment: treatment,
      metricName: 'latency2',
      metricValue: latency,
      aggregationType: AggregationTypes.PERCENTILE
    });*/

    res.json({
      buttonText,
      treatment,
      userId: allocationKey
    });
  } catch (error)
  {
    console.error('Error getting button details:', error);
    res.status(500).json({ error: 'An error occurred while getting button details' });
  }
});

// POST endpoint to handle button clicks and submit metrics
app.post('/button-click', async (req, res) =>
{
  try
  {
    const { treatment, userId } = req.body;
    const experimentId = '<your-experiment>';
    const stage = Stages.PROD;
    const segment = await simpleab.getSegment();
    let base = 0;
    if (treatment === 'T3')
    {
      base += 10;
    }

    // Track metrics
    await simpleab.trackMetricWithSegment({
      experimentID: experimentId,
      stage: stage,
      segment: segment,
      treatment: treatment,
      metricName: 'clicks',
      metricValue: base + 1,
      aggregationType: AggregationTypes.SUM
    });

    await simpleab.trackMetricWithSegment({
      experimentID: experimentId,
      stage: stage,
      segment: segment,
      treatment: treatment,
      metricName: 'revenue',
      metricValue: base + Math.random() * 10, // Random revenue between 0 and 10
      aggregationType: AggregationTypes.AVERAGE
    });

    res.json({ success: true });
  } catch (error)
  {
    console.error('Error handling button click:', error);
    res.status(500).json({ error: 'An error occurred while handling button click' });
  }
});

app.listen(port, () =>
{
  console.log(`Server running at http://localhost:${port}`);
});
