rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    
    // --- Helper Functions ---
    
    // User data ကို လုံခြုံစွာ ယူရန်
    function getUser() {
      let path = /databases/$(database)/documents/users/$(request.auth.uid);
      return exists(path) ? get(path).data : null;
    }
    
    // Teacher ဟုတ်မဟုတ် စစ်ရန်
    function isTeacher() {
      let user = getUser();
      return user != null && user.role == 'Teacher';
    }

    // ၁။ Users Collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth != null && (request.auth.uid == userId || isTeacher());
    }

    // ၂။ Messages Rules
    match /messages/{messageId} {
      allow create: if request.auth != null;
      allow read: if request.auth != null && (
        isTeacher() ||
        resource.data.type == "group" || 
        resource.data.senderId == request.auth.uid || 
        resource.data.receiverId == request.auth.uid ||
        (resource.data.convoId != null && resource.data.convoId.matches(".*" + request.auth.uid + ".*"))
      );
      allow delete, update: if request.auth != null && (resource.data.senderId == request.auth.uid || isTeacher());
    }

    // ၃။ Payments Collection (ဤနေရာတွင် နာမည်မှားကို ပြင်ထားပါသည်)
    match /payments/{payId} {
      allow create: if request.auth != null;
      
      // ဆရာဖြစ်လျှင် အကုန်ဖတ်/ပြင် နိုင်သည်၊ ကျောင်းသားဖြစ်လျှင် မိမိစာရင်းသာ ရမည်
      allow read, update: if request.auth != null && (
        isTeacher() || 
        (resource.data.studentId == request.auth.uid)
      );
    }

    // ၄။ Discussions (Comments)
    match /discussions/{commentId} {
      allow read, create: if request.auth != null;
      // Teacher သို့မဟုတ် ပိုင်ရှင်ကသာ ဖျက်နိုင်မည်
      allow delete: if request.auth != null && (request.auth.uid == resource.data.userId || isTeacher());
    }

    // ၅။ Submissions (Assignment/Project)
    match /submissions/{subId} {
      allow create: if request.auth != null;
      // ဆရာအပြင် ကျောင်းသားကိုယ်တိုင်လည်း သူ့စာကို သူပြန်ဖတ်ခွင့်ရှိရမည်
      allow read: if request.auth != null && (request.auth.uid == resource.data.studentId || isTeacher());
      allow update: if request.auth != null && isTeacher();
    }

    // ၆။ Settings & Course Structure
    match /settings/{id} { 
      allow read: if true; 
      allow write: if request.auth != null && isTeacher(); 
    }
    match /course_structure/{id} { 
      allow read: if true; 
      allow write: if request.auth != null && isTeacher(); 
    }
    match /courses/{id} { 
      allow read: if request.auth != null; 
    }
  }
}