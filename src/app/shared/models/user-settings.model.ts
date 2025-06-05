export class UserSettings {
  constructor(
    public salutation: string | null = null,
    public userFirstName: string | null = null,
    public userLastName: string | null = null,
    public headline: string | null = null,
    public biography: string | null = null,
    public language: string | null = null,
    public website: string | null = null,
    public facebookUserName: string | null = null,
    public instagramUserName: string | null = null,
    public twitterUserName: string | null = null,
    public tiktokUserName: string | null = null,
    public linkedInPublicProfileUrl: string | null = null,
    public youtubeUserName: string | null = null,
    public emailId: string | null = null,
    public streetAddress: string | null = null,
    public houseNumber: string | null = null,
    public city: string | null = null,
    public state: string | null = null,
    public zipCode: string | null = null,
    public country: string | null = null,
    public phoneNumber: string | null = null,
    public preferredPaymentMethod: string | null = null
  ) {}

  setPaymentMethod(method: string) {
    this.preferredPaymentMethod = method;
  }

    setEmailId(emailId: string) {
    this.emailId = emailId;
  }

  static fromObject(obj: any): UserSettings {
    const user = new UserSettings();
    Object.assign(user, obj);
    return user;
  }
}
