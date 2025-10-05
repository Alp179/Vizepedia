// utils/anonymousDataService.js - Updated to use sessionStorage instead of localStorage

export class AnonymousDataService {
  static STORAGE_KEYS = {
    USER_SELECTIONS: 'userSelections',
    APPLICATION_ID: 'latestApplicationId',
    IS_ANONYMOUS: 'isAnonymous',
    USER_ANSWERS: 'userAnswers',
    CREATED_AT: 'anonymousCreatedAt',
    COMPLETED_DOCUMENTS: 'completedDocuments',
    // ADDED: Compatibility with old wellcome system
    WELLCOMES_ANSWERED: 'wellcomesAnswered'
  };

  // FIXED: Save user selections to sessionStorage - Only set isAnonymous AFTER onboarding completion
  static saveUserSelections(selections) {
    const existingSelections = this.getUserSelections() || {};
    const updatedSelections = {
      ...existingSelections,
      ...selections,
      updatedAt: new Date().toISOString()
    };
    
    sessionStorage.setItem(this.STORAGE_KEYS.USER_SELECTIONS, JSON.stringify(updatedSelections));
    
    // FIXED: Only set isAnonymous AFTER onboarding is completed
    if (this.hasCompletedOnboarding()) {
      sessionStorage.setItem(this.STORAGE_KEYS.IS_ANONYMOUS, 'true');
    }
    
    // Set created date if not exists
    if (!sessionStorage.getItem(this.STORAGE_KEYS.CREATED_AT)) {
      sessionStorage.setItem(this.STORAGE_KEYS.CREATED_AT, new Date().toISOString());
    }
  }

  // Get user selections from sessionStorage
  static getUserSelections() {
    const selections = sessionStorage.getItem(this.STORAGE_KEYS.USER_SELECTIONS);
    return selections ? JSON.parse(selections) : null;
  }

  // FIXED: Save completed user answers (equivalent to Supabase userAnswers table)
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

    sessionStorage.setItem(this.STORAGE_KEYS.USER_ANSWERS, JSON.stringify(userAnswers));
    
    // FIXED: Mark both onboarding complete AND set anonymous flag
    this.markOnboardingComplete();
    sessionStorage.setItem(this.STORAGE_KEYS.IS_ANONYMOUS, 'true');
    
    return userAnswers;
  }

  // Get user answers (equivalent to fetchUserSelectionsDash)
  static getUserAnswers(applicationId) {
    const answers = sessionStorage.getItem(this.STORAGE_KEYS.USER_ANSWERS);
    if (!answers) {
      // If no saved answers, try to convert from selections
      return this.convertSelectionsToAnswers(applicationId);
    }

    const parsedAnswers = JSON.parse(answers);
    
    // If applicationId is provided, check if it matches
    if (applicationId && parsedAnswers.id !== applicationId) {
      return this.convertSelectionsToAnswers(applicationId);
    }

    return [parsedAnswers]; // Return as array to match Supabase format
  }

  // CRITICAL: Convert sessionStorage selections to Supabase format for document filtering
  static convertSelectionsToAnswers(applicationId) {
    const selections = this.getUserSelections();
    if (!selections) return null;

    const convertedAnswer = {
      id: applicationId || this.getConsistentApplicationId(),
      userId: 'anonymous',
      ans_country: selections.country || '',
      ans_purpose: selections.purpose || '',
      ans_profession: selections.profession || '',
      ans_vehicle: selections.vehicle || '',
      ans_kid: selections.kid !== undefined ? selections.kid : false,
      ans_accommodation: selections.accommodation || '',
      ans_hassponsor: selections.hasSponsor || false,
      ans_sponsor_profession: selections.sponsorProfession || null,
      has_appointment: false,
      has_filled_form: false,
      created_at: sessionStorage.getItem(this.STORAGE_KEYS.CREATED_AT) || new Date().toISOString()
    };

    return [convertedAnswer]; // Return as array to match Supabase format
  }

  // Document completion for anonymous users
  static completeDocument(applicationId, documentName) {
    const completedDocs = this.getCompletedDocuments() || {};
    
    if (!completedDocs[applicationId]) {
      completedDocs[applicationId] = {};
    }
    
    completedDocs[applicationId][documentName] = true; // Simple boolean format for consistency

    sessionStorage.setItem(this.STORAGE_KEYS.COMPLETED_DOCUMENTS, JSON.stringify(completedDocs));
    return { data: { document_name: documentName, completed: true } };
  }

  // Fetch completed documents for anonymous users
  static fetchCompletedDocuments(applicationId) {
    const completedDocs = this.getCompletedDocuments() || {};
    const appDocs = completedDocs[applicationId] || {};
    
    // Convert boolean format to object format
    return Object.keys(appDocs)
      .filter(docName => appDocs[docName] === true)
      .map(docName => ({
        document_name: docName,
        completion_date: new Date().toISOString(),
        status: 'completed',
        application_id: applicationId,
        userId: 'anonymous'
      }));
  }

  // Uncomplete document for anonymous users
  static uncompleteDocument(applicationId, documentName) {
    const completedDocs = this.getCompletedDocuments() || {};
    
    if (completedDocs[applicationId] && completedDocs[applicationId][documentName]) {
      delete completedDocs[applicationId][documentName];
      sessionStorage.setItem(this.STORAGE_KEYS.COMPLETED_DOCUMENTS, JSON.stringify(completedDocs));
    }

    return { data: null };
  }

  // Helper to get completed documents
  static getCompletedDocuments() {
    const docs = sessionStorage.getItem(this.STORAGE_KEYS.COMPLETED_DOCUMENTS);
    return docs ? JSON.parse(docs) : {};
  }

  // Check if user has completed onboarding
  static hasCompletedOnboarding() {
    // UPDATED: Check both new system and old wellcomesAnswered flag for backward compatibility
    const oldWellcomesAnswered = sessionStorage.getItem(this.STORAGE_KEYS.WELLCOMES_ANSWERED) === 'true';
    
    if (oldWellcomesAnswered) {
      return true;
    }
    
    const selections = this.getUserSelections();
    if (!selections) return false;
    
    // Check if all required fields are filled
    const requiredFields = ['country', 'purpose', 'profession', 'vehicle', 'accommodation'];
    const hasRequiredFields = requiredFields.every(field => 
      selections[field] !== undefined && selections[field] !== null && selections[field] !== ''
    );

    // Check kid field specifically (can be boolean false)
    const hasKidField = selections.kid !== undefined && selections.kid !== null;

    return hasRequiredFields && hasKidField;
  }

  // FIXED: Mark onboarding as complete and set anonymous flag
  static markOnboardingComplete() {
    sessionStorage.setItem(this.STORAGE_KEYS.WELLCOMES_ANSWERED, 'true');
    // Also set isAnonymous when onboarding is completed
    sessionStorage.setItem(this.STORAGE_KEYS.IS_ANONYMOUS, 'true');
  }

  // Generate application ID for anonymous users
  static generateApplicationId() {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9);
    return `anonymous-${timestamp}-${random}`;
  }

  // Get or create application ID
  static getApplicationId() {
    let applicationId = sessionStorage.getItem(this.STORAGE_KEYS.APPLICATION_ID);
    
    if (!applicationId) {
      applicationId = this.generateApplicationId();
      sessionStorage.setItem(this.STORAGE_KEYS.APPLICATION_ID, applicationId);
    }
    
    return applicationId;
  }

  // NEW: Get consistent application ID (solves ID mismatch problem)
  static getConsistentApplicationId() {
    // First try to get ID from userAnswers
    const userAnswers = sessionStorage.getItem(this.STORAGE_KEYS.USER_ANSWERS);
    if (userAnswers) {
      const parsed = JSON.parse(userAnswers);
      if (parsed.id) {
        return parsed.id;
      }
    }
    
    // Otherwise use normal getApplicationId
    return this.getApplicationId();
  }

  // UPDATED: Get current application ID for migration (ensures we have the right ID)
  static getCurrentApplicationId() {
    const userAnswers = this.getUserAnswers();
    if (userAnswers && userAnswers.length > 0) {
      return userAnswers[0].id;
    }
    return this.getConsistentApplicationId();
  }

  // FIXED: Check if user is anonymous (only if onboarding is completed)
  static isAnonymousUser() {
    const hasAnonymousFlag = sessionStorage.getItem(this.STORAGE_KEYS.IS_ANONYMOUS) === 'true';
    const hasCompletedOnboarding = this.hasCompletedOnboarding();
    
    // User is only considered anonymous if they have completed onboarding AND have the anonymous flag
    return hasAnonymousFlag && hasCompletedOnboarding;
  }

  // FIXED: Better Supabase format conversion for dashboard compatibility with consistent ID
  static convertToSupabaseFormat() {
    const selections = this.getUserSelections();
    const applicationId = this.getConsistentApplicationId();
    const createdAt = sessionStorage.getItem(this.STORAGE_KEYS.CREATED_AT) || new Date().toISOString();
    
    if (!selections) return null;

    // Return in exact Supabase format that getDocumentsForSelections expects
    return [{
      id: applicationId,
      ans_country: selections.country || '',
      ans_purpose: selections.purpose || '',
      ans_profession: selections.profession || '',
      ans_vehicle: selections.vehicle || '',
      ans_kid: selections.kid !== undefined ? selections.kid : false,
      ans_accommodation: selections.accommodation || '',
      ans_hassponsor: selections.hasSponsor || false,
      ans_sponsor_profession: selections.sponsorProfession || null,
      created_at: createdAt,
      has_appointment: false,
      has_filled_form: false,
      user_id: 'anonymous'
    }];
  }

  // ENHANCED: Prepare data for migration to authenticated user
  static prepareDataForMigration() {
    try {
      const selections = this.getUserSelections();
      const completedDocs = this.getCompletedDocuments();
      const applicationId = this.getConsistentApplicationId();
      const createdAt = sessionStorage.getItem(this.STORAGE_KEYS.CREATED_AT) || new Date().toISOString();
      
      console.log("🔄 Preparing anonymous data for migration:");
      console.log("selections:", selections);
      console.log("completedDocs:", completedDocs);
      console.log("applicationId:", applicationId);

      if (!selections || !this.hasCompletedOnboarding()) {
        console.log("❌ No onboarding data to migrate");
        return { userAnswers: null, completedDocuments: null };
      }

      // Convert selections to userAnswers format
      const userAnswers = {
        ans_country: selections.country,
        ans_purpose: selections.purpose,
        ans_profession: selections.profession,
        ans_vehicle: selections.vehicle,
        ans_kid: selections.kid !== undefined ? selections.kid : false,
        ans_accommodation: selections.accommodation,
        ans_hassponsor: selections.hasSponsor || false,
        ans_sponsor_profession: selections.sponsorProfession || null,
        has_appointment: false,
        has_filled_form: false,
        created_at: createdAt
      };

      // CRITICAL: Convert completed documents to migration format with detailed logging
      console.log("🔍 Processing completed documents for migration...");
      console.log("Raw completed documents:", completedDocs);
      
      let completedDocuments = {};
      
      if (completedDocs && typeof completedDocs === 'object') {
        Object.keys(completedDocs).forEach(appId => {
          console.log(`📋 Processing application ${appId}:`, completedDocs[appId]);
          
          if (completedDocs[appId] && typeof completedDocs[appId] === 'object') {
            completedDocuments[appId] = {};
            
            Object.keys(completedDocs[appId]).forEach(docName => {
              const docValue = completedDocs[appId][docName];
              console.log(`  - Document ${docName}:`, docValue);
              
              if (docValue === true) {
                // Simple boolean format - convert to object
                completedDocuments[appId][docName] = {
                  document_name: docName,
                  completion_date: new Date().toISOString(),
                  status: 'completed'
                };
              } else if (typeof docValue === 'object' && docValue.document_name) {
                // Already in object format
                completedDocuments[appId][docName] = docValue;
              }
            });
          }
        });
      }
      
      console.log("✅ Processed completed documents:", completedDocuments);
      console.log("✅ Migration data prepared:", { userAnswers, completedDocuments });
      
      return {
        userAnswers: userAnswers,
        completedDocuments: completedDocuments
      };
    } catch (error) {
      console.error("❌ Error preparing data for migration:", error);
      return { userAnswers: null, completedDocuments: null };
    }
  }

  // NEW: Get all completed documents in proper format for migration
  static getAllCompletedDocuments() {
    try {
      const completedDocs = this.getCompletedDocuments();
      
      // Convert to migration format
      const migrationFormat = {};
      
      Object.keys(completedDocs).forEach(applicationId => {
        const appDocs = completedDocs[applicationId];
        migrationFormat[applicationId] = {};
        
        Object.keys(appDocs).forEach(docName => {
          if (appDocs[docName] === true) {
            migrationFormat[applicationId][docName] = {
              document_name: docName,
              completion_date: new Date().toISOString(),
              status: 'completed'
            };
          }
        });
      });
      
      return migrationFormat;
    } catch (error) {
      console.error("Error getting completed documents for migration:", error);
      return {};
    }
  }

  // NEW: Check if migration is needed
  static needsMigration() {
    const selections = this.getUserSelections();
    const hasCompletedOnboarding = this.hasCompletedOnboarding();
    
    return hasCompletedOnboarding && selections && Object.keys(selections).length > 0;
  }

  // ENHANCED: Clear all anonymous data with confirmation
  static clearData() {
    try {
      console.log("🧹 Clearing anonymous data after successful migration");
      
      // Clear all anonymous-related sessionStorage items
      Object.values(this.STORAGE_KEYS).forEach(key => {
        sessionStorage.removeItem(key);
      });
      
      // Also clear any other anonymous flags
      sessionStorage.removeItem('currentStep');
      
      console.log("✅ Anonymous data cleared successfully");
    } catch (error) {
      console.error("Error clearing anonymous data:", error);
    }
  }

  // Check if this is a bot (no sessionStorage interactions for bots)
  static isBotUser() {
  if (typeof window === 'undefined') return false;
  
  const userAgent = navigator.userAgent.toLowerCase();
  const botPatterns = [
    // Search engine bots
    'googlebot', 'bingbot', 'slurp', 'duckduckbot', 
    'baiduspider', 'yandexbot',
    
    // Social media bots
    'facebookexternalhit', 'twitterbot', 'linkedinbot', 'whatsapp',
    
    // CRITICAL: AdSense bots
    'mediapartners-google',  // AdSense crawler
    'adsbot-google',         // AdSense verification
    'googlebot-image',
    'googlebot-news',
    'googlebot-video',
    
    // Other important crawlers
    'crawler', 'spider', 'bot', 'scraper',
    'check', 'monitor', 'validator'
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
      createdAt: sessionStorage.getItem(this.STORAGE_KEYS.CREATED_AT) || new Date().toISOString()
    };
  }

  // UPDATED: Check if user should be redirected to onboarding (compatible with new flow)
  static shouldRedirectToOnboarding(currentPath) {
    const hasSelections = this.getUserSelections();
    const hasCompletedOnboarding = this.hasCompletedOnboarding();
    const dashboardPaths = ['/dashboard'];
    
    // If on dashboard without any onboarding completion, show static dashboard instead of redirect
    if (dashboardPaths.some(path => currentPath.startsWith(path))) {
      if (!hasCompletedOnboarding && !hasSelections) {
        // Return null to show static dashboard, not redirect
        return null;
      }
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

  // FIXED: Update specific selection field
  static updateSelection(field, value) {
    const existingSelections = this.getUserSelections() || {};
    const updatedSelections = {
      ...existingSelections,
      [field]: value,
      updatedAt: new Date().toISOString()
    };
    
    sessionStorage.setItem(this.STORAGE_KEYS.USER_SELECTIONS, JSON.stringify(updatedSelections));
    
    // FIXED: Only set isAnonymous if onboarding is now complete
    if (this.hasCompletedOnboarding()) {
      this.markOnboardingComplete();
    }
  }

  // Get specific selection field
  static getSelection(field) {
    const selections = this.getUserSelections();
    return selections ? selections[field] : null;
  }

  // DEBUGGING: Log current anonymous data (for troubleshooting)
  static debugLogData() {
    console.log('=== ANONYMOUS USER DEBUG ===');
    console.log('Raw selections:', this.getUserSelections());
    console.log('Converted to Supabase format:', this.convertToSupabaseFormat());
    console.log('Application ID:', this.getApplicationId());
    console.log('Consistent Application ID:', this.getConsistentApplicationId());
    console.log('Has completed onboarding:', this.hasCompletedOnboarding());
    console.log('Old wellcomesAnswered flag:', sessionStorage.getItem(this.STORAGE_KEYS.WELLCOMES_ANSWERED));
    console.log('isAnonymous flag:', sessionStorage.getItem(this.STORAGE_KEYS.IS_ANONYMOUS));
    console.log('Is anonymous user (computed):', this.isAnonymousUser());
    console.log('Needs migration:', this.needsMigration());
    console.log('Migration data:', this.prepareDataForMigration());
    console.log('Completed documents:', this.getCompletedDocuments());
    console.log('=============================');
  }

  // MIGRATION HELPER: Transfer existing localStorage data to sessionStorage (run once)
  static migrateFromLocalStorage() {
    try {
      console.log("🔄 Migrating from localStorage to sessionStorage...");
      
      // Check if already migrated
      if (sessionStorage.getItem('migration_completed')) {
        console.log("✅ Migration already completed");
        return;
      }
      
      let hasMigratedData = false;
      
      // Migrate each key from localStorage to sessionStorage
      Object.values(this.STORAGE_KEYS).forEach(key => {
        const localData = localStorage.getItem(key);
        if (localData) {
          console.log(`📦 Migrating ${key}:`, localData);
          sessionStorage.setItem(key, localData);
          localStorage.removeItem(key); // Clean up old data
          hasMigratedData = true;
        }
      });
      
      // Also migrate any other anonymous flags
      const additionalKeys = ['currentStep'];
      additionalKeys.forEach(key => {
        const localData = localStorage.getItem(key);
        if (localData) {
          sessionStorage.setItem(key, localData);
          localStorage.removeItem(key);
          hasMigratedData = true;
        }
      });
      
      if (hasMigratedData) {
        console.log("✅ Data migrated successfully from localStorage to sessionStorage");
        sessionStorage.setItem('migration_completed', 'true');
      } else {
        console.log("📝 No localStorage data found to migrate");
        sessionStorage.setItem('migration_completed', 'true');
      }
      
    } catch (error) {
      console.error("❌ Error during localStorage to sessionStorage migration:", error);
    }
  }
}