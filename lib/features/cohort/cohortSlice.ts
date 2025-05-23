import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

// Define types for each form section
export interface BasicDetailsState {
  programDetail: string;
  centerDetail: string;
  cohortId: string;
  startDate: string | null;
  endDate: string | null;
  timeSlot: string;
  totalSeats: number;
  baseFee: number;
  isGSTIncluded: boolean;
}

export interface ApplicationFormState {
  applicationFormDetail: any[];
}

export interface LitmusTestState {
  litmusTasks: any[];
  scholarshipSlabs: any[];
  litmusTestDuration: string;
}

export interface FeeStructureState {
  applicationFee: string;
  tokenFee: string;
  semesters: string;
  installmentsPerSemester: string;
  oneShotDiscount: string;
}

export interface FeePreviewState {
  feeStructureDetails: any[];
}

export interface CollaboratorsState {
  collaborators: any[];
}

// Define the complete cohort state
export interface CohortState {
  _id?: string;
  basicDetails: BasicDetailsState;
  applicationForm: ApplicationFormState;
  litmusTest: LitmusTestState;
  feeStructure: FeeStructureState;
  feePreview: FeePreviewState;
  collaborators: CollaboratorsState;
  currentStep: number;
}

// Initial state
const initialState: CohortState = {
  basicDetails: {
    programDetail: "",
    centerDetail: "",
    cohortId: "",
    startDate: null,
    endDate: null,
    timeSlot: "",
    totalSeats: 0,
    baseFee: 0,
    isGSTIncluded: false,
  },
  applicationForm: {
    applicationFormDetail: [],
  },
  litmusTest: {
    litmusTasks: [],
    scholarshipSlabs: [],
    litmusTestDuration: "",
  },
  feeStructure: {
    applicationFee: "",
    tokenFee: "",
    semesters: "",
    installmentsPerSemester: "",
    oneShotDiscount: "",
  },
  feePreview: {
    feeStructureDetails: [],
  },
  collaborators: {
    collaborators: [],
  },
  currentStep: 0,
};

const cohortSlice = createSlice({
  name: "cohort",
  initialState,
  reducers: {
    // Set the entire cohort data (useful for initialization)
    setCohortData: (state, action: PayloadAction<any>) => {
      const cohortData = action.payload;
      if (cohortData._id) state._id = cohortData._id;

      // Basic Details
      if (cohortData.programDetail)
        state.basicDetails.programDetail = cohortData.programDetail;
      if (cohortData.centerDetail)
        state.basicDetails.centerDetail = cohortData.centerDetail;
      if (cohortData.cohortId)
        state.basicDetails.cohortId = cohortData.cohortId;
      if (cohortData.startDate)
        state.basicDetails.startDate = cohortData.startDate;
      if (cohortData.endDate) state.basicDetails.endDate = cohortData.endDate;
      if (cohortData.timeSlot)
        state.basicDetails.timeSlot = cohortData.timeSlot;
      if (cohortData.totalSeats)
        state.basicDetails.totalSeats = cohortData.totalSeats;
      if (cohortData.baseFee) state.basicDetails.baseFee = cohortData.baseFee;
      if (cohortData.isGSTIncluded !== undefined)
        state.basicDetails.isGSTIncluded = cohortData.isGSTIncluded;

      // Application Form
      if (cohortData.applicationFormDetail)
        state.applicationForm.applicationFormDetail =
          cohortData.applicationFormDetail;

      // LITMUS Test
      if (
        cohortData.litmusTestDetail &&
        cohortData.litmusTestDetail.length > 0
      ) {
        const litmusData = cohortData.litmusTestDetail[0];
        if (litmusData.litmusTasks)
          state.litmusTest.litmusTasks = litmusData.litmusTasks;
        if (litmusData.scholarshipSlabs)
          state.litmusTest.scholarshipSlabs = litmusData.scholarshipSlabs;
        if (litmusData.litmusTestDuration)
          state.litmusTest.litmusTestDuration = litmusData.litmusTestDuration;
      }

      // Fee Structure
      if (cohortData.cohortFeesDetail) {
        if (cohortData.cohortFeesDetail.applicationFee)
          state.feeStructure.applicationFee =
            cohortData.cohortFeesDetail.applicationFee;
        if (cohortData.cohortFeesDetail.tokenFee)
          state.feeStructure.tokenFee = cohortData.cohortFeesDetail.tokenFee;
        if (cohortData.cohortFeesDetail.semesters)
          state.feeStructure.semesters = cohortData.cohortFeesDetail.semesters;
        if (cohortData.cohortFeesDetail.installmentsPerSemester)
          state.feeStructure.installmentsPerSemester =
            cohortData.cohortFeesDetail.installmentsPerSemester;
        if (cohortData.cohortFeesDetail.oneShotDiscount)
          state.feeStructure.oneShotDiscount =
            cohortData.cohortFeesDetail.oneShotDiscount;
      }

      // Fee Preview
      if (cohortData.feeStructureDetails)
        state.feePreview.feeStructureDetails = cohortData.feeStructureDetails;

      // Collaborators
      if (cohortData.collaborators)
        state.collaborators.collaborators = cohortData.collaborators;
    },

    // Update basic details
    updateBasicDetails: (
      state,
      action: PayloadAction<Partial<BasicDetailsState>>
    ) => {
      state.basicDetails = { ...state.basicDetails, ...action.payload };
    },

    // Update application form
    updateApplicationForm: (
      state,
      action: PayloadAction<Partial<ApplicationFormState>>
    ) => {
      state.applicationForm = { ...state.applicationForm, ...action.payload };
    },

    // Update LITMUS test
    updateLitmusTest: (
      state,
      action: PayloadAction<Partial<LitmusTestState>>
    ) => {
      state.litmusTest = { ...state.litmusTest, ...action.payload };
    },

    // Update fee structure
    updateFeeStructure: (
      state,
      action: PayloadAction<Partial<FeeStructureState>>
    ) => {
      state.feeStructure = { ...state.feeStructure, ...action.payload };
    },

    // Update fee preview
    updateFeePreview: (
      state,
      action: PayloadAction<Partial<FeePreviewState>>
    ) => {
      state.feePreview = { ...state.feePreview, ...action.payload };
    },

    // Update collaborators
    updateCollaborators: (
      state,
      action: PayloadAction<Partial<CollaboratorsState>>
    ) => {
      state.collaborators = { ...state.collaborators, ...action.payload };
    },

    // Set current step
    setCurrentStep: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload;
    },

    // Reset cohort state
    resetCohortState: (_state) => {
      return initialState;
    },
  },
});

export const {
  setCohortData,
  updateBasicDetails,
  updateApplicationForm,
  updateLitmusTest,
  updateFeeStructure,
  updateFeePreview,
  updateCollaborators,
  setCurrentStep,
  resetCohortState,
} = cohortSlice.actions;

export default cohortSlice.reducer;
