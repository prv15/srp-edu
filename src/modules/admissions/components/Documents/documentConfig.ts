export interface AdmissionDocument {
  id: string;
  title: string;
  required: boolean;
  accept?: string;
}

export interface DocumentGroup {
  title: string;
  documents: AdmissionDocument[];
}

export interface DocumentConfig {
  school: DocumentGroup[];
  degree: DocumentGroup[];
  training: DocumentGroup[];
}

export const documentConfig: DocumentConfig = {
  school: [
    {
      title: "Identity Documents",
      documents: [
        {
          id: "photo",
          title: "Student Photo",
          required: true,
        },
        {
          id: "aadhaar",
          title: "Aadhaar Card",
          required: true,
        },
      ],
    },
    {
      title: "Academic Documents",
      documents: [
        {
          id: "birth",
          title: "Birth Certificate",
          required: true,
        },
        {
          id: "tc",
          title: "Transfer Certificate",
          required: true,
        },
        {
          id: "marksheet",
          title: "Previous Marksheet",
          required: true,
        },
      ],
    },
  ],

  degree: [
    {
      title: "Identity Documents",
      documents: [
        {
          id: "photo",
          title: "Student Photo",
          required: true,
        },
        {
          id: "aadhaar",
          title: "Aadhaar Card",
          required: true,
        },
        {
          id: "signature",
          title: "Signature",
          required: true,
        },
      ],
    },
    {
      title: "Academic Documents",
      documents: [
        {
          id: "10th",
          title: "10th Marksheet",
          required: true,
        },
        {
          id: "12th",
          title: "12th Marksheet",
          required: true,
        },
        {
          id: "tc",
          title: "Transfer Certificate",
          required: true,
        },
        {
          id: "migration",
          title: "Migration Certificate",
          required: false,
        },
        {
          id: "character",
          title: "Character Certificate",
          required: false,
        },
      ],
    },
    {
      title: "Certificates",
      documents: [
        {
          id: "caste",
          title: "Caste Certificate",
          required: false,
        },
        {
          id: "income",
          title: "Income Certificate",
          required: false,
        },
      ],
    },
  ],

  training: [
    {
      title: "Documents",
      documents: [
        {
          id: "photo",
          title: "Student Photo",
          required: true,
        },
        {
          id: "aadhaar",
          title: "Aadhaar Card",
          required: true,
        },
        {
          id: "qualification",
          title: "Qualification Certificate",
          required: true,
        },
      ],
    },
  ],
};