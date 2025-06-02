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
      console.log("Redux: Setting cohort data", cohortData);

      if (cohortData._id) state._id = cohortData._id;

      // Basic Details
      if (cohortData.programDetail !== undefined)
        state.basicDetails.programDetail = cohortData.programDetail;
      if (cohortData.centerDetail !== undefined)
        state.basicDetails.centerDetail = cohortData.centerDetail;
      if (cohortData.cohortId !== undefined)
        state.basicDetails.cohortId = cohortData.cohortId;
      if (cohortData.startDate !== undefined)
        state.basicDetails.startDate = cohortData.startDate;
      if (cohortData.endDate !== undefined)
        state.basicDetails.endDate = cohortData.endDate;
      if (cohortData.timeSlot !== undefined)
        state.basicDetails.timeSlot = cohortData.timeSlot;
      if (cohortData.totalSeats !== undefined)
        state.basicDetails.totalSeats = cohortData.totalSeats;
      if (cohortData.baseFee !== undefined)
        state.basicDetails.baseFee = cohortData.baseFee;
      if (cohortData.isGSTIncluded !== undefined)
        state.basicDetails.isGSTIncluded = cohortData.isGSTIncluded;

      // Application Form
      if (cohortData.applicationFormDetail !== undefined)
        state.applicationForm.applicationFormDetail =
          cohortData.applicationFormDetail;

      // LITMUS Test
      if (
        cohortData.litmusTestDetail &&
        cohortData.litmusTestDetail.length > 0
      ) {
        const litmusData = cohortData.litmusTestDetail[0];
        if (litmusData.litmusTasks !== undefined)
          state.litmusTest.litmusTasks = litmusData.litmusTasks;
        if (litmusData.scholarshipSlabs !== undefined)
          state.litmusTest.scholarshipSlabs = litmusData.scholarshipSlabs;
        if (litmusData.litmusTestDuration !== undefined)
          state.litmusTest.litmusTestDuration = litmusData.litmusTestDuration;
      }

      // Fee Structure
      if (cohortData.cohortFeesDetail) {
        if (cohortData.cohortFeesDetail.applicationFee !== undefined)
          state.feeStructure.applicationFee =
            cohortData.cohortFeesDetail.applicationFee;
        if (cohortData.cohortFeesDetail.tokenFee !== undefined)
          state.feeStructure.tokenFee = cohortData.cohortFeesDetail.tokenFee;
        if (cohortData.cohortFeesDetail.semesters !== undefined)
          state.feeStructure.semesters = cohortData.cohortFeesDetail.semesters;
        if (cohortData.cohortFeesDetail.installmentsPerSemester !== undefined)
          state.feeStructure.installmentsPerSemester =
            cohortData.cohortFeesDetail.installmentsPerSemester;
        if (cohortData.cohortFeesDetail.oneShotDiscount !== undefined)
          state.feeStructure.oneShotDiscount =
            cohortData.cohortFeesDetail.oneShotDiscount;
      }

      // Fee Preview
      if (cohortData.feeStructureDetails !== undefined)
        state.feePreview.feeStructureDetails = cohortData.feeStructureDetails;

      // Collaborators - Always update, even if empty array
      if (cohortData.collaborators !== undefined) {
        state.collaborators.collaborators = Array.isArray(
          cohortData.collaborators
        )
          ? cohortData.collaborators
          : [];
        console.log(
          "Redux: Updated collaborators",
          state.collaborators.collaborators
        );
      }
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

    // Update collaborators - improved handling
    updateCollaborators: (state, action: PayloadAction<any>) => {
      console.log("Redux: Updating collaborators", action.payload);

      // If the payload has a collaborators property, use that
      if (action.payload.collaborators !== undefined) {
        state.collaborators.collaborators = Array.isArray(
          action.payload.collaborators
        )
          ? action.payload.collaborators
          : [];
      }
      // If the payload is just the collaborators array
      else if (Array.isArray(action.payload)) {
        state.collaborators.collaborators = action.payload;
      }
      // If it's a partial update to the collaborators state
      else {
        state.collaborators = { ...state.collaborators, ...action.payload };
      }

      console.log(
        "Redux: Collaborators after update",
        state.collaborators.collaborators
      );
    },

    // Delete collaborators - improved logic
    deleteCollaborators: (
      state,
      action: PayloadAction<{
        cohortId: string;
        collaboratorId: string;
        roleId: string;
      }>
    ) => {
      const { collaboratorId, roleId } = action.payload;
      console.log("Redux: Deleting collaborator", action.payload);

      state.collaborators.collaborators = state.collaborators.collaborators
        .map((collaborator: any) => {
          if (collaborator._id === collaboratorId) {
            // Remove the specific role from this collaborator
            const updatedRoles =
              collaborator.roles?.filter((role: any) => role._id !== roleId) ||
              [];

            // If no roles left, return null to filter out this collaborator
            if (updatedRoles.length === 0) {
              return null;
            }

            // Return collaborator with updated roles
            return {
              ...collaborator,
              roles: updatedRoles,
            };
          }
          return collaborator;
        })
        .filter(Boolean); // Remove null entries

      console.log(
        "Redux: Collaborators after delete",
        state.collaborators.collaborators
      );
    },

    // Edit collaborator - improved logic
    editCollaborator: (
      state,
      action: PayloadAction<{
        collaboratorId?: string;
        roleId?: string;
        role?: string;
      }>
    ) => {
      const { collaboratorId, roleId, role } = action.payload;
      console.log("Redux: Editing collaborator", action.payload);

      state.collaborators.collaborators = state.collaborators.collaborators.map(
        (collaborator: any) => {
          if (collaborator._id === collaboratorId) {
            return {
              ...collaborator,
              roles: collaborator.roles?.map((roleObj: any) =>
                roleObj._id === roleId ? { ...roleObj, role: role } : roleObj
              ),
            };
          }
          return collaborator;
        }
      );

      console.log(
        "Redux: Collaborators after edit",
        state.collaborators.collaborators
      );
    },

    // Add individual collaborator
    addCollaborator: (state, action: PayloadAction<any>) => {
      console.log("Redux: Adding collaborator", action.payload);
      state.collaborators.collaborators.push(action.payload);
    },

    // Delete collaborator
    deleteCollaborator: (state, action: PayloadAction<string>) => {
      const idToDelete = action.payload;
      if (!idToDelete) return;

      state.collaborators.collaborators =
        state.collaborators.collaborators.filter(
          (collaborator: any) =>
            collaborator._id && collaborator._id !== idToDelete
        );
    },

    // Set current step
    setCurrentStep: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload;
    },

    // Reset cohort state
    resetCohortState: () => {
      console.log("Redux: Resetting cohort state");
      return { ...initialState };
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
  deleteCollaborators,
  editCollaborator,
  addCollaborator,
  setCurrentStep,
  resetCohortState,
  deleteCollaborator,
} = cohortSlice.actions;

export default cohortSlice.reducer;
