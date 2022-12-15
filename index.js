const puppeteer = require('puppeteer')

function parseInfo(arrayInfo){
  return {
	'status'	  : arrayInfo[0],
	'currency'	  : arrayInfo[1],
	'blockheight' : arrayInfo[2],
	'connections' : arrayInfo[3],
	'lastupdate'  : arrayInfo[4],
	'lastchecked' : arrayInfo[5],
	'notice'      : arrayInfo[6],
  }
}

async function getStatusObj() {
  const URL = 'https://bittrex.com/status/'
  const browser = await puppeteer.launch({
	args: ['--no-sandbox']
  })
  const page = await browser.newPage()
  await page.setViewport({ width: 1366, height: 1768})
  await page.goto(URL)

  await page.$eval('input[class=uXu9fEYqR]',
	el => {
	  el.focus()
	})

  await page.keyboard.type('DFI')
  await page.waitForSelector("tr[data-testid='data-table-row-DFI']")

  let results = await page.$eval('table tbody', 
	tbody => [...tbody.rows].map(
	  r => [...r.cells].map(
		c => c.innerText
	  )
	)
  ).catch( err => {throw err})

  await browser.close()
  return JSON.stringify(parseInfo(results[0]))
}


// Server
const http = require('http');

const requestListener = async (req, res) => {
  try {
	res.writeHead(200);
	let obj = await getStatusObj()
	res.end(obj);
  } catch (error) {
	res.writeHead(404);
	res.end(error.message);
  }
}
const server = http.createServer(requestListener);

let port = process.env.PORT ? process.env.PORT : 8080
server.listen(port);
