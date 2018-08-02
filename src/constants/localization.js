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
    close: "بستن",
    startChat: "شروع گفتگو",
    edited: "اصلاح شد",
    waitingForMessageFetching: "در حالت دریافت پیامهای قبلی",
    creatingChatWith: (firstName ,lastName) => {
      return `در حال ایجاد گفتگو با ${firstName} ${lastName}`;
    },
    thereIsNoChat: "چتی وجود ندارد",
    thereIsNoMessageToShow: "هیچ پیامی برای نمایش وجود ندارد",
    mobilePhone: "شماره موبایل",
    firstName: "نام",
    lastName: "نام خانوادگی",
    replyTo: "پاسخ به",
    isNotPodUser: "کاربر پاد نیست"
  },
  it: {

  }
});
strings.setLanguage("fa");
export default strings;