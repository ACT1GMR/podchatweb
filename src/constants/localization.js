import LocalizedStrings from "react-localization";

let strings = new LocalizedStrings({
  fa: {
    pleaseStartAThreadFirst: "یه نفرو برای چت انتخاب کنید!!",
    pleaseWriteHere: "اینجا بنویسید...",
    waitingForChatInstance: "در حالت برقراری ارتباط با سرور چت",
    add: "اضافه کردن",
    addContact: "اضافه کردن اطلاعات تماس",
    contactList: "لیست تماس ها",
    cancel: "لغو",
    waitingForMessageFetching: "در حالت دریافت پیامها",
    thereIsNoMessageToShow: "هیچ پیامی برای نمایش وجود ندارد",
    mobilePhone: "شماره موبایل",
    firstName: "نام",
    lastName: "نام خانوادگی"
  },
  it: {

  }
});
strings.setLanguage("fa");
export default strings;