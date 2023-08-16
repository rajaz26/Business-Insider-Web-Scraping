const playwright = require("playwright");
let main = async () => {
  //code execution
  const browser = await playwright.chromium.launch({
    headless: false,
  });

  //page
  var page = await browser.newPage();
  const site = "kohls";

  //Page Link
  await page.goto("https://coupons.businessinsider.com/" + site);
  page.setDefaultNavigationTimeout(0);
  page.waitForNavigation();

  //working
  var myItemList = await page.$$("div._15mbvey5");
  var itemsInItemsCreationPhase = await Promise.all(
    myItemList.map((item) => item.$("._6o5mg71"))
  );
  const len = await page.locator("data-testid=Codes").innerText();
  const limit = len.charAt(len.length - 2);
  const data = [];
  var index = 0;
  var discountType;
  var amountOff;
  var percentOff;
  var valueOFF;

  while (index < limit) {
    var myItemList = await page.$$("div._15mbvey5");
    var codeList = await Promise.all(
      myItemList.map((item) => item.$("._6o5mg71"))
    );

    // const title = await itemsInItemsCreationPhase[index].click();
    var [popup] = await Promise.all([
      page.waitForEvent("popup"),
      await codeList[index].click(),
      // (heading = await headingList[index].innerText()),
      // (valueOFF = await offList[index].innerText()),
    ]);
    page = popup;
    await page.locator("._9asx0w1._9asx0w1").click();
    await page.locator("data-testid=Codes").click();

    var headingList = await page.$$("h3._163biu99");
    var title = await headingList[index].innerText();

    var offList = await page.$$("span._1xj46po0");
    var valueOFF = await offList[index].innerText();

    // var coupon = await page.locator("._6o5mg73._1fdk0lb0._1fdk0lb2._1fdk0lb1");
    page.waitForNavigation();
    var coupon;
    if (!page.locator("._6o5mg73._1fdk0lb0._1fdk0lb2._1fdk0lb1")) {
      console.log("Get this deal");
      index++;
    } else {
      var coupon = await page.locator(
        "._6o5mg73._1fdk0lb0._1fdk0lb2._1fdk0lb1"
      );
      page.waitForNavigation();
      // console.log(valueOFF);
      const code = await coupon.innerText();
      let check = valueOFF.charAt(0);
      if (check == "$") {
        amountOff = valueOFF;
        percentOff = null;
        discountType = "Amount OFF";
      } else {
        percentOff = valueOFF;
        amountOff = null;
        discountType = "Percent OFF";
      }
      data.push({ title, discountType, percentOff, amountOff, code });
      index++;
    }
  }
  console.log(data);
};
main();
