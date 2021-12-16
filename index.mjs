import puppeteer from "puppeteer";
import chalk from "chalk";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config("./.env");
const log = console.log;
let currentHours = null;

const shopeeURL = "https://shopee.co.id/";

const target =
  "https://shopee.co.id/Kabel-Data-Micro-USB-Putih-Panjang-1-Meter-Cable-Bulat-1m-100cm-1A-Smartphone-Handphone-Hp-Mikro-i.31169310.425438352";

const sayHi = () => {
  log(
    chalk.redBright(`
    Hi. Thanks for using my shopee bot. ❤️
    Author: Nazir Bahrul Ulum
    github: https://github.com/devnazir
    team: PotatosStudio
  `)
  );
};

const waitingLog = () => {
  log(chalk.green("Loading..."));
};

const openBrowser = async () => {
  const webSocketDebuggerUrl = await (
    await axios.get("http://127.0.0.1:9222/json/version")
  ).data.webSocketDebuggerUrl;

  const browser = await puppeteer.connect({
    headless: false,
    executablePath: `${process.env.PROGRAMFILES}\\Google\\Chrome\\Application\\chrome.exe`,
    defaultViewport: null,
    args: ["--start-maximized"],
    browserWSEndpoint: webSocketDebuggerUrl,
  });

  return browser;
};

const statusOfResponse = (response) => {
  log(
    chalk.italic.green(`
  url: ${response.frame()?._url ?? "error"}
  status: ${response?.status() ?? "error"}
  ok: ${response?.ok() ?? "error"}
  `)
  );
};

const goToLoginPage = async (page) => {
  try {
    const loginPage = await page.goto(`${shopeeURL}buyer/login`, {
      timeout: 0,
      waitUntil: "domcontentloaded",
    });

    const response = await page.waitForResponse(() => {
      return loginPage._status === 200;
    });

    if (response.ok()) {
      statusOfResponse(response);
    }

    return response;
  } catch (err) {
    log(chalk.red(err));
  }
};

const loginShopee = async (email, password, page) => {
  try {
    const emailElement = await page.waitForSelector(
      "input[type='text'].yReWDs"
    );
    const passwordElement = await page.waitForSelector(
      "input[type='password'].yReWDs"
    );
    const submitElement = await page.waitForSelector("button._1ruZ5a");

    const emailInputHasValue = await page.$eval(
      "input[type='text'].yReWDs",
      (e) => e.value
    );
    const passwordInputHasValue = await page.$eval(
      "input[type='password'].yReWDs",
      (e) => e.value
    );

    if (emailElement && !emailInputHasValue) {
      await emailElement.type(email);
      log(chalk.green("✅ successfully write your email"));
    }

    if (passwordElement && !passwordInputHasValue) {
      await passwordElement.type(password);
      log(chalk.green("✅ successfully write your password"));
    }

    if (emailInputHasValue && passwordInputHasValue) {
      submitElement.click();
      page.waitForTimeout(10000).then(async () => {
        const usernameElement = await page.$("div.navbar__username");
        const verifyButton = await page.$("button.WMREvW");

        if (usernameElement) {
          log(chalk.green("✅ successfully to login"));
        } else {
          log(chalk.red("❌ failed to login"));
        }

        if (verifyButton) {
          await verifyButton.click();
          log(chalk.green("check your email from shopee for verify"));
        }
      });
    }
  } catch (err) {
    log(chalk.red(err));
  }
};

const goToHomepage = async (page) => {
  log(chalk.blue("checking auth..."));

  try {
    const homePage = await page.goto(`${shopeeURL}`, {
      timeout: 0,
    });

    const response = await page.waitForResponse(() => {
      return homePage._status === 200;
    });

    if (response.ok()) {
      statusOfResponse(response);
      log(chalk.green("Loading..."));

      const usernameElement = await page.waitForSelector(
        "div.navbar__username"
      );

      if (usernameElement) {
        return true;
      } else {
        return false;
      }
    }
  } catch (err) {
    log(chalk.red(err));
  }
};

const goToFlashSalePage = async (page) => {
  log(chalk.blue("trying redirect to flash sale page..."));

  try {
    const flashSalePage = await page.goto(`${shopeeURL}flash_sale`, {
      timeout: 0,
      waitUntil: "domcontentloaded",
    });

    const response = await page.waitForResponse(() => {
      return flashSalePage._status === 200;
    });

    if (response.ok()) {
      statusOfResponse(response);
      log(chalk.green("✅ redirected"));
    }
  } catch (err) {
    log(chalk.red(err));
  }
};

const tryToCheckout = async (page) => {
  if (currentHours === 13) {
    log(chalk.green("trying to checkout.."));
    await page.goto(target, {
      timeout: 0,
    });
    page.waitForSelector("button._3Kiuzg").then(async () => {
      const toCart = await page.waitForSelector("button._3Kiuzg");
      await toCart.click();

      page
        .goto(`${shopeeURL}cart`, {
          timeout: 0,
          waitUntil: "domcontentloaded",
        })
        .then(async (res) => {
          const selectTopCart = await page.waitForSelector("div.aCSbhb");
          const checked = await selectTopCart._page.$(".stardust-checkbox");
          checked.click().then(async () => {
            const checkout = await page.$(
              "button.shopee-button-solid.shopee-button-solid--primary"
            );
            await checkout.click();
          });
        });
    });
  } else {
    setTimeout(async () => {
      await tryToCheckout(page);
    }, 1000);
    log("still waiting for 12 a clock");
  }
};

async function runShopeeBot() {
  try {
    sayHi();
    waitingLog();

    const browser = await openBrowser();
    const page = await browser.newPage();

    const checkHasLogged = await goToHomepage(page);

    if (checkHasLogged) {
      log(chalk.green("✅ logged"));
      // await goToFlashSalePage(page);
      await tryToCheckout(page);
      // page.waitForSelector(".flash-sale-session").then(async (res) => {
      //   const one = (await page.$$(".flash-sale-session"))[1];
      //   await one.click();
      // });

      return;
    } else {
      log(
        chalk.green("❌ you havent logged. trying to automatically login...")
      );
      const loginPage = await goToLoginPage(page);
      if (loginPage.ok()) {
        await loginShopee(
          `${process.env.email}`,
          `${process.env.password}`,
          page
        );

        await goToFlashSalePage(page);
      }
    }
  } catch (err) {
    log(chalk.red(err));
  }
}

const checkHoursEverySecond = setInterval(() => {
  currentHours = new Date().getHours();
  log(chalk.green(`detail: ${new Date().toLocaleString()}`));
}, 1000);

runShopeeBot();
