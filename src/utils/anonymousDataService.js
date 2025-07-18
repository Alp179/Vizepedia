// utils/anonymousDataService.js - Complete localStorage management for anonymous users

export class AnonymousDataService {
  static STORAGE_KEYS = {
    USER_SELECTIONS: 'userSelections',
    APPLICATION_ID: 'latestApplicationId',
    IS_ANONYMOUS: 'isAnonymous',
    USER_ANSWERS: 'userAnswers',
    CREATED_AT: 'anonymousCreatedAt',
    COMPLETED_DOCUMENTS: 'completedDocuments'
  };

  // Save user selections to localStorage
  static saveUserSelections(selections) {
    const existingSelections = this.getUserSelections() || {};
    const updatedSelections = {
      ...existingSelections,
      ...selections,
      updatedAt: new Date().toISOString()
    };
    
    localStorage.setItem(this.STORAGE_KEYS.USER_SELECTIONS, JSON.stringify(updatedSelections));
    localStorage.setItem(this.STORAGE_KEYS.IS_ANONYMOUS, 'true');
    
    // Set created date if not exists
    if (!localStorage.getItem(this.STORAGE_KEYS.CREATED_AT)) {
      localStorage.setItem(this.STORAGE_KEYS.CREATED_AT, new Date().toISOString());
    }
  }

  // Get user selections from localStorage
  static getUserSelections() {
    const selections = localStorage.getItem(this.STORAGE_KEYS.USER_SELECTIONS);
    return selections ? JSON.parse(selections) : null;
  }

  // Save completed user answers (equivalent to Supabase userAnswers table)
  static saveUserAnswers(answers) {
    const applicationId = this.getApplicationId();
    const userAnswers = {
      id: applicationId,
      userId: 'anonymous',
      ans_country: answers.country,
      ans_purpose: answers.purpose,
      ans_profession: answers.profession,
      ans_vehicle: answers.vehicle,
      ans_kid: answers.kid,
      ans_accommodation: answers.accommodation,
      ans_hassponsor: answers.hasSponsor,
      ans_sponsor_profession: answers.sponsorProfession || null,
      has_appointment: false,
      has_filled_form: false,
      created_at: new Date().toISOString()
    };

    localStorage.setItem(this.STORAGE_KEYS.USER_ANSWERS, JSON.stringify(userAnswers));
    return userAnswers;
  }

  // Get user answers (equivalent to fetchUserSelectionsDash)
  static getUserAnswers(applicationId) {
    const answers = localStorage.getItem(this.STORAGE_KEYS.USER_ANSWERS);
    if (!answers) return null;

    const parsedAnswers = JSON.parse(answers);
    
    // If applicationId is provided, check if it matches
    if (applicationId && parsedAnswers.id !== applicationId) {
      return null;
    }

    return [parsedAnswers]; // Return as array to match Supabase format
  }

  // Document completion for anonymous users
  static completeDocument(documentName, applicationId) {
    const completedDocs = this.getCompletedDocuments() || {};
    
    if (!completedDocs[applicationId]) {
      completedDocs[applicationId] = {};
    }
    
    completedDocs[applicationId][documentName] = {
      document_name: documentName,
      completion_date: new Date().toISOString(),
      status: true,
      application_id: applicationId,
      userId: 'anonymous'
    };

    localStorage.setItem(this.STORAGE_KEYS.COMPLETED_DOCUMENTS, JSON.stringify(completedDocs));
    return { data: completedDocs[applicationId][documentName] };
  }

  // Fetch completed documents for anonymous users
  static fetchCompletedDocuments(applicationId) {
    const completedDocs = this.getCompletedDocuments() || {};
    const appDocs = completedDocs[applicationId] || {};
    
    return Object.values(appDocs);
  }

  // Uncomplete document for anonymous users
  static uncompleteDocument(documentName, applicationId) {
    const completedDocs = this.getCompletedDocuments() || {};
    
    if (completedDocs[applicationId] && completedDocs[applicationId][documentName]) {
      delete completedDocs[applicationId][documentName];
      localStorage.setItem(this.STORAGE_KEYS.COMPLETED_DOCUMENTS, JSON.stringify(completedDocs));
    }

    return { data: null };
  }

  // Helper to get completed documents
  static getCompletedDocuments() {
    const docs = localStorage.getItem(this.STORAGE_KEYS.COMPLETED_DOCUMENTS);
    return docs ? JSON.parse(docs) : {};
  }

  // Check if user has completed onboarding
  static hasCompletedOnboarding() {
    const selections = this.getUserSelections();
    if (!selections) return false;
    
    // Check if all required fields are filled
    const requiredFields = ['country', 'purpose', 'profession', 'vehicle', 'accommodation'];
    return requiredFields.every(field => selections[field] && selections[field] !== '');
  }

  // Generate application ID for anonymous users
  static generateApplicationId() {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9);
    return `anonymous-${timestamp}-${random}`;
  }

  // Get or create application ID
  static getApplicationId() {
    let applicationId = localStorage.getItem(this.STORAGE_KEYS.APPLICATION_ID);
    
    if (!applicationId) {
      applicationId = this.generateApplicationId();
      localStorage.setItem(this.STORAGE_KEYS.APPLICATION_ID, applicationId);
    }
    
    return applicationId;
  }

  // Check if user is anonymous
  static isAnonymousUser() {
    return localStorage.getItem(this.STORAGE_KEYS.IS_ANONYMOUS) === 'true';
  }

  // Convert localStorage data to Supabase format for compatibility
  static convertToSupabaseFormat() {
    const selections = this.getUserSelections();
    const applicationId = this.getApplicationId();
    const createdAt = localStorage.getItem(this.STORAGE_KEYS.CREATED_AT) || new Date().toISOString();
    
    if (!selections) return null;

    // Mock Supabase user selections format
    return [{
      id: applicationId,
      ans_country: selections.country || '',
      ans_purpose: selections.purpose || '',
      ans_profession: selections.profession || '',
      ans_vehicle: selections.vehicle || '',
      ans_kid: selections.kid || false,
      ans_accommodation: selections.accommodation || '',
      ans_hassponsor: selections.hasSponsor || false,
      ans_sponsor_profession: selections.sponsorProfession || null,
      created_at: createdAt,
      has_appointment: false,
      has_filled_form: false,
      user_id: 'anonymous'
    }];
  }

  // Clear all anonymous data
  static clearData() {
    Object.values(this.STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }

  // Migrate anonymous data to authenticated user (for when they sign up)
  static prepareDataForMigration() {
    const selections = this.getUserSelections();
    const userAnswers = localStorage.getItem(this.STORAGE_KEYS.USER_ANSWERS);
    const completedDocs = this.getCompletedDocuments();
    
    return {
      selections: selections ? JSON.parse(JSON.stringify(selections)) : null,
      userAnswers: userAnswers ? JSON.parse(userAnswers) : null,
      completedDocuments: completedDocs || {},
      applicationId: this.getApplicationId()
    };
  }

  // Check if this is a bot (no localStorage interactions for bots)
  static isBotUser() {
    if (typeof window === 'undefined') return false;
    
    const userAgent = navigator.userAgent.toLowerCase();
    const botPatterns = [
      'googlebot', 'bingbot', 'slurp', 'duckduckbot', 
      'baiduspider', 'yandexbot', 'facebookexternalhit', 
      'twitterbot', 'linkedinbot', 'whatsapp'
    ];
    
    return botPatterns.some(pattern => userAgent.includes(pattern));
  }

  // Get demo dashboard data for anonymous users
  static getDemoDashboardData() {
    const selections = this.getUserSelections();
    if (!selections) return null;

    return {
      country: selections.country || 'Almanya',
      purpose: selections.purpose || 'Turizm',
      profession: selections.profession || '',
      vehicle: selections.vehicle || '',
      accommodation: selections.accommodation || '',
      hasSponsor: selections.hasSponsor || false,
      createdAt: localStorage.getItem(this.STORAGE_KEYS.CREATED_AT) || new Date().toISOString()
    };
  }

  // Check if user should be redirected to onboarding
  static shouldRedirectToOnboarding(currentPath) {
    const hasSelections = this.getUserSelections();
    const dashboardPaths = ['/dashboard'];
    
    // If on dashboard without selections, redirect to onboarding
    if (dashboardPaths.some(path => currentPath.startsWith(path)) && !hasSelections) {
      return '/wellcome-2';
    }
    
    return null;
  }

  // Get progress percentage for onboarding
  static getOnboardingProgress() {
    const selections = this.getUserSelections();
    if (!selections) return 0;
    
    const steps = [
      selections.country,
      selections.purpose,
      selections.profession,
      selections.vehicle,
      selections.accommodation
    ];
    
    const completedSteps = steps.filter(step => step && step !== '').length;
    return Math.round((completedSteps / steps.length) * 100);
  }

  // Update specific selection field
  static updateSelection(field, value) {
    const existingSelections = this.getUserSelections() || {};
    const updatedSelections = {
      ...existingSelections,
      [field]: value,
      updatedAt: new Date().toISOString()
    };
    
    localStorage.setItem(this.STORAGE_KEYS.USER_SELECTIONS, JSON.stringify(updatedSelections));
    localStorage.setItem(this.STORAGE_KEYS.IS_ANONYMOUS, 'true');
  }

  // Get specific selection field
  static getSelection(field) {
    const selections = this.getUserSelections();
    return selections ? selections[field] : null;
  }

  // Check if all required selections are complete
  static isOnboardingComplete() {
    const selections = this.getUserSelections();
    if (!selections) return false;

    const requiredFields = ['country', 'purpose', 'profession', 'vehicle', 'accommodation'];
    const hasRequiredFields = requiredFields.every(field => 
      selections[field] !== undefined && selections[field] !== null && selections[field] !== ''
    );

    // Check kid field specifically (can be boolean false)
    const hasKidField = selections.kid !== undefined && selections.kid !== null;

    return hasRequiredFields && hasKidField;
  }
}