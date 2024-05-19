export type GoogleProfile = {
  id: string;
  displayName: string;
  name: GoogleName;
  emails: GoogleEmail[];
  photos: GooglePhoto[];
  provider: string;
};

export type GoogleName = {
  familyName: string;
  givenName: string;
};

export type GoogleEmail = {
  value: string;
  verified: boolean;
};

export type GooglePhoto = {
  value: string;
};
