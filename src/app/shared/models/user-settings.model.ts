export class UserSettings {
  constructor(
    public salutation?: string,
    public userFirstName?: string,
    public userLastName?: string,
    public headline?: string,
    public biography?: string,
    public language?: string,
    public website?: string,
    public facebookUserName?: string,
    public instagramUserName?: string,
    public twitterUserName?: string,
    public tiktokUserName?: string,
    public linkedInPublicProfileUrl?: string,
    public youtubeUserName?: string,
    public emailId?: string,
    public streetAddress?: string,
    public houseNumber?: string,
    public city?: string,
    public state?: string,
    public zipCode?: string,
    public country?: string,
    public phoneNumber?: string,
    public preferredPaymentMethod?: string
  ) {}

  setPaymentMethod(method: string) {
    this.preferredPaymentMethod = method;
  }

  static fromObject(obj: any): UserSettings {
    const user = new UserSettings();
    Object.assign(user, obj);
    return user;
  }
}
