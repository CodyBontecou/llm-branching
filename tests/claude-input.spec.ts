import { test, expect } from '@playwright/test'

test.describe('Claude Input Component', () => {
  test('should submit form with mocked data', async ({ page }) => {
    // Mock the API response
    await page.route('https://api.anthropic.com/v1/messages', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          message: {
            content: [
              {
                text: 'This is a mocked response from Claude.',
              },
            ],
          },
        }),
      })
    })

    // Navigate to the page with your component
    await page.goto('http://localhost:3000/')

    // Fill in the form
    await page.fill('#apiKey', 'mock-api-key')
    await page.fill('#userInput', 'Hello, Claude!')

    // Upload a file
    await page.setInputFiles('#fileInput', {
      name: 'test.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('This is a test file content'),
    })

    // Click the submit button
    await page.click('button:has-text("Send Request")')

    // Wait for the response to be displayed
    await page.waitForSelector('pre')

    // Check if the mocked response is displayed
    const responseText = await page.textContent('pre')
    expect(responseText).toContain('This is a mocked response from Claude.')
  })
})
