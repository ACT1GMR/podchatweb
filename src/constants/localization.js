import LocalizedStrings from "react-localization";

let strings = new LocalizedStrings({
  fa: {
    tryAgain: "تلاش دوباره",
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
    groupDescription: "توضیحات گروه",
    waitingForMessageFetching: "در حالت دریافت پیامهای قبلی",
    creatingChatWith: (firstName, lastName) => {
      return `در حال ایجاد گفتگو با ${firstName} ${lastName}`;
    },
    thereIsNoChat: "چتی وجود ندارد",
    select: "انتخاب",
    forwardTo: "انتخاب چت برای فرستادن",
    thereIsNoMessageToShow: "هیچ پیامی برای نمایش وجود ندارد",
    mobilePhone: "شماره موبایل",
    firstName: "نام",
    groupName: "نام گروه",
    lastName: "نام خانوادگی",
    replyTo: "پاسخ به",
    isNotPodUser: "کاربر پاد نیست",
    forwardFrom: "ارسال شده از طرف",
    selectContacts: "انتخاب مخاطبها",
    createGroup: "ایجاد گروه",
    member: "عضو",
    you: "شما",
    addMember: "اضافه کردن عضو",
    saveSettings: "ذخیره تغییرات",
    groupSettings: "تنظیمات گروه",
    chatInfo: "اطلاعات چت",
    years: "سال",
    months: "ماه",
    days: "روز",
    hours: "ساعت",
    minutes: "دقیقه",
    seconds: "ثانیه",
    yesterday: "دیروز",
    recently: "چند لحظه پیش",
    sentAFile: "فایلی فرستاد",
    remove: "حذف",
    groupInfo: "اطلاعات گروه",
    contactInfo: "اطلاعات تماس",
    dropYourFileHere: "فایلاتون رو بندازید اینجا",
    imageText: "متن تصویر",
    send: "بفرست",
    sendingImages: "ارسال عکس ( ها )",
    prettifyDateString(string) {
      if (~string.indexOf("پیش")) {
        return string;
      }
      return `${string} پیش`;
    },
    createdAGroup(person) {
      return `${person} گروهی ساخت`
    },
    createdAChat(person) {
      return `${person} چتی ساخت`
    },
  },
  it: {}
});
strings.setLanguage("fa");
export default strings;