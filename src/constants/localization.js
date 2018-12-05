import LocalizedStrings from "react-localization";

let strings = new LocalizedStrings({
  fa: {
    podchat: "پادچت",
    search: "جستجو",
    tryAgain: "تلاش دوباره",
    pleaseStartAThreadFirst: "یه نفرو برای چت انتخاب کنید!!",
    pleaseWriteHere: "اینجا بنویسید...",
    waitingForChatInstance: "در حالت برقراری ارتباط با سرور چت",
    add: "اضافه کردن",
    addContact: "اضافه کردن مخاطب",
    contactList: "لیست مخاطبین",
    cancel: "لغو",
    close: "بستن",
    startChat: "شروع گفتگو",
    edited: "اصلاح شد",
    groupDescription: "توضیحات گروه",
    waitingForMessageFetching: "در حالت دریافت پیامهای قبلی",
    creatingChatWith: (firstName, lastName) => {
      return `در حال ایجاد گفتگو با ${firstName} ${lastName}`;
    },
    thereIsNoChat: "گفتگویی وجود ندارد",
    select: "انتخاب",
    forwardTo: "انتخاب چت برای فرستادن",
    thereIsNoMessageToShow: "هیچ پیامی برای نمایش وجود ندارد",
    mobilePhone: "شماره موبایل",
    unknown: "نامشخص",
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
    contactInfo: "اطلاعات مخاطب",
    dropYourFileHere: "فایلاتون رو بندازید اینجا",
    imageText: "متن تصویر",
    send: "بفرست",
    sendingImages: "ارسال عکس ( ها )",
    areYouSureAboutDeletingMessage(messagesCount){
      if(!messagesCount) {
        return "از حذف این پیغام مطمئنید";
      }
      return `از حذف ${messagesCount} پیام مطمئنید`
    },
    modalMedia:{
      CLOSE: "بستن",
      NEXT: "بعدی",
      PREV: "قبلی",
      ERROR: "نمیتونم باز کنم این فایلو فکر کنم مشکل شبکست",
      PLAY_START: "شروع به نمایش خودکار",
      PLAY_STOP: "توقف نمایش خودکار",
      FULL_SCREEN: "نمایش تمام صفحه",
      THUMBS: "تصاویر کوچک بند انگشتی",
      ZOOM: "بزرگنمایی",
    },
    messagesCount(messagesCount){
      return `${messagesCount} پیام`
    },
    thereIsNoContactWithThisKeyword(keyword){
      if(!keyword && !keyword.trim()) {
        return 'مخاطبی با مشخصات وارد شده یافت نشد...'
      }
      return `مخاطبی با مشخصات "${keyword}" وجود ندارد `;
    },
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
    noResult: "نتیجه ای وجود ندارد",
    searchSomething: "کلمه ای تایپ کنید",
    searchMessages: "جستجو پیامها",
    chatState: {
      networkDisconnected: "در انتظار شبکه",
      reconnecting: "اتصال به شبکه"
    }
  },
  it: {}
});
strings.setLanguage("fa");
export default strings;