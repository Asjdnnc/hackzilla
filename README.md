# Backend Schema Documentation

This document describes the Mongoose schemas used in the backend of the website, based on the files found in the `backend/models` directory.

---

## feedback.js (`backend/models/feedback.js`)

This schema defines the structure for storing user feedback messages.

*   **name** (`String`, required, trimmed): The name of the person providing feedback.
*   **email** (`String`, required, trimmed, lowercase, matches email format): The email address of the person providing feedback.
*   **message** (`String`, required, trimmed): The content of the feedback message.
*   **timestamps** (`true`): Automatically adds `createdAt` and `updatedAt` fields.

---

## Footer.js (`backend/models/Footer.js`)

This file defines multiple schemas related to the footer section of the website.

### CollegeInfo Schema

Stores the college's contact and location information.

*   **name** (`String`, required, default: "Indian Institute of Information Technology, Sonepat"): The name of the college.
*   **address** (`String`, required): The physical address of the college.
*   **phone** (`String`, required): The contact phone number(s).
*   **email** (`String`, required): The contact email address.
*   **mapUrl** (`String`, required): A URL for the college's location on a map.
*   **timestamps** (`true`): Automatically adds `createdAt` and `updatedAt` fields.

### ImportantLink Schema

Defines the structure for important links.

*   **title** (`String`, required): The display text for the link.
*   **url** (`String`, required): The URL the link points to.
*   **timestamps** (`true`): Automatically adds `createdAt` and `updatedAt` fields.

### ResourceLink Schema

Defines the structure for resource links.

*   **title** (`String`, required): The display text for the link.
*   **url** (`String`, required): The URL the link points to.
*   **timestamps** (`true`): Automatically adds `createdAt` and `updatedAt` fields.

### BannerLink Schema

Defines the structure for banner links, including an image.

*   **title** (`String`, required): The display text for the link.
*   **url** (`String`, required): The URL the link points to.
*   **image** (`String`, required): The URL or path to the banner image.
*   **timestamps** (`true`): Automatically adds `createdAt` and `updatedAt` fields.

---

## jobs.js (`backend/models/jobs.js`)

This file defines schemas for job postings and the overall jobs page.

### job Schema

Defines the structure for individual job postings.

*   **name** (`String`, required, trimmed): The title or name of the job.
*   **publishDate** (`Date`, required, default: `Date.now`): The date the job was published.
*   **downloadUrl** (`String`, required, trimmed): The URL to download the job details (e.g., a PDF).
*   **status** (`String`, enum: ['Active', 'Inactive'], default: 'Active'): The current status of the job posting.
*   **timestamps** (`true`): Automatically adds `createdAt` and `updatedAt` fields.

### jobsPage Schema

Defines the structure for the main jobs page content.

*   **overview** (`String`, required, trimmed): The introductory or overview text for the jobs page.
*   **jobs** (`Array` of `jobSchema`): An array of embedded job documents.
*   **timestamps** (`true`): Automatically adds `createdAt` and `updatedAt` fields.

---

## FooterPages/Convocation.js (`backend/models/FooterPages/Convocation.js`)

This file defines schemas for convocation-related information.

### document Schema (Embedded)

Defines the structure for downloadable documents related to convocation.

*   **title** (`String`, required, trimmed): The title of the document.
*   **fileUrl** (`String`, required, trimmed): The URL to the document file.
*   **uploadDate** (`Date`, default: `Date.now`): The date the document was uploaded.

### Convocation Schema

Defines the structure for overall convocation information.

*   **title** (`String`, required, trimmed): The title of the convocation event (e.g., "Convocation 2024").
*   **overview** (`String`, required, trimmed): Overview text about the convocation.
*   **date** (`Date`, required): The date of the convocation event.
*   **time** (`String`, required, trimmed): The time of the convocation event.
*   **venue** (`String`, required, trimmed): The venue of the convocation event.
*   **chiefGuest** (`String`, trimmed): The name of the chief guest.
*   **documents** (`Array` of `document Schema`): An array of embedded document schemas.
*   **photoGalleryLink** (`String`, trimmed): A link to the photo gallery for the convocation.
*   **liveStreamLink** (`String`, trimmed): A link to the live stream of the convocation.
*   **isCurrent** (`Boolean`, default: `false`): Flag to indicate if this is the current or upcoming convocation.
*   **isDeleted** (`Boolean`, default: `false`): Flag for soft deletion.
*   **lastUpdated** (`Date`, default: `Date.now`): Timestamp for the last update.
*   **timestamps** (`true`): Automatically adds `createdAt` and `updatedAt` fields.

---

## FooterPages/Examinations.js (`backend/models/FooterPages/Examinations.js`)

This file defines schemas for examination-related information.

### notice Schema (Embedded)

Defines the structure for examination notices.

*   **title** (`String`, required, trimmed): The title of the notice.
*   **fileUrl** (`String`, required, trimmed): The URL to the notice file.
*   **publishDate** (`Date`, default: `Date.now`): The date the notice was published.
*   **isDeleted** (`Boolean`, default: `false`): Flag for soft deletion.
*   **lastUpdated** (`Date`, default: `Date.now`): Timestamp for the last update.

### ExaminationPage Schema

Defines the structure for the overall examination page content.

*   **overview** (`String`, required, trimmed): Overview text for the examination page.
*   **examSchedule** (`String`, trimmed): Text or link related to the exam schedule.
*   **gradingPolicy** (`String`, trimmed): Text or link related to the grading policy.
*   **academicIntegrity** (`String`, trimmed): Text or link related to academic integrity policy.
*   **contactInfo** (`String`, trimmed): Contact information for the examination section.
*   **notices** (`Array` of `notice Schema`): An array of embedded notice schemas.
*   **resultLinks** (`Array` of embedded schemas - not defined here, but implied by usage): Likely links to results pages.
*   **pastPapersLinks** (`Array` of embedded schemas - not defined here, but implied by usage): Likely links to past exam papers.
*   **regulationsLinks** (`Array` of embedded schemas - not defined here, but implied by usage): Likely links to examination regulations.
*   **timestamps** (`true`): Automatically adds `createdAt` and `updatedAt` fields.

---

## FooterPages/StudentForms.js (`backend/models/FooterPages/StudentForms.js`)

This file defines schemas for student forms.

### studentForm Schema (Embedded)

Defines the structure for downloadable student forms.

*   **title** (`String`, required, trimmed): The title of the form.
*   **fileUrl** (`String`, required, trimmed): The URL to the form file.
*   **uploadDate** (`Date`, default: `Date.now`): The date the form was uploaded.
*   **isDeleted** (`Boolean`, default: `false`): Flag for soft deletion.
*   **lastUpdated** (`Date`, default: `Date.now`): Timestamp for the last update.

### StudentFormsPage Schema

Defines the structure for the overall student forms page content.

*   **overview** (`String`, required, trimmed): Overview text for the student forms page.
*   **forms** (`Array` of `studentForm Schema`): An array of embedded student form schemas.
*   **timestamps** (`true`): Automatically adds `createdAt` and `updatedAt` fields.

---

## FooterPages/TimeTables.js (`backend/models/FooterPages/TimeTables.js`)

This file defines schemas for timetables.

### timetable Schema (Embedded)

Defines the structure for downloadable timetables.

*   **title** (`String`, required, trimmed): The title of the timetable.
*   **fileUrl** (`String`, required, trimmed): The URL to the timetable file.
*   **uploadDate** (`Date`, default: `Date.now`): The date the timetable was uploaded.
*   **isDeleted** (`Boolean`, default: `false`): Flag for soft deletion.
*   **lastUpdated** (`Date`, default: `Date.now`): Timestamp for the last update.

### TimeTablesPage Schema

Defines the structure for the overall timetables page content.

*   **overview** (`String`, required, trimmed): Overview text for the timetables page.
*   **timetables** (`Array` of `timetable Schema`): An array of embedded timetable schemas.
*   **timestamps** (`true`): Automatically adds `createdAt` and `updatedAt` fields.

---

## FooterPages/Notices.js (`backend/models/FooterPages/Notices.js`)

This file defines schemas for general notices.

### notice Schema (Embedded)

Defines the structure for downloadable notices.

*   **title** (`String`, required, trimmed): The title of the notice.
*   **fileUrl** (`String`, required, trimmed): The URL to the notice file.
*   **publishDate** (`Date`, default: `Date.now`): The date the notice was published.
*   **isDeleted** (`Boolean`, default: `false`): Flag for soft deletion.
*   **lastUpdated** (`Date`, default: `Date.now`): Timestamp for the last update.

### NoticesPage Schema

Defines the structure for the overall notices page content.

*   **overview** (`String`, required, trimmed): Overview text for the notices page.
*   **notices** (`Array` of `notice Schema`): An array of embedded notice schemas.
*   **timestamps** (`true`): Automatically adds `createdAt` and `updatedAt` fields.

---

## Home/carousel.js (`backend/models/Home/carousel.js`)

This schema defines the structure for items in a carousel on the homepage.

*   **imageUrl** (`String`, required, trimmed): The URL of the image for the carousel item.
*   **caption** (`String`, trimmed): A caption or description for the carousel item.
*   **linkUrl** (`String`, trimmed): A URL that the carousel item links to.
*   **order** (`Number`, required, default: 0): The order in which the item should appear in the carousel.
*   **isActive** (`Boolean`, default: `true`): Flag to indicate if the item is active.
*   **isDeleted** (`Boolean`, default: `false`): Flag for soft deletion.
*   **lastUpdated** (`Date`, default: `Date.now`): Timestamp for the last update.
*   **timestamps** (`true`): Automatically adds `createdAt` and `updatedAt` fields.

---

## People/phdStudents.js (`backend/models/People/phdStudents.js`)

This schema defines the structure for PhD student information.

*   **name** (`String`, required, trimmed): The name of the PhD student.
*   **image** (`String`, required): The URL or path to the student's image.
*   **since** (`String`, required, trimmed): The year the student started their PhD.
*   **topic** (`String`, required, trimmed): The topic of the student's research.
*   **supervisor** (`ObjectId`, ref: 'Faculty', required): Reference to the faculty member supervising the student.
*   **email** (`String`, required, trimmed, lowercase): The student's email address.
*   **status** (`String`, required, enum: ['Active', 'Completed', 'On Leave'], default: 'Active'): The current status of the student's PhD.
*   **researchArea** (`String`, required, trimmed): The student's research area.
*   **publications** (`Array` of `ObjectId`, ref: 'Publication'): References to the student's publications.
*   **timestamps** (`true`): Automatically adds `createdAt` and `updatedAt` fields.

---

## People/faculty.js (`backend/models/People/faculty.js`)

This schema defines the structure for faculty member information.

### education Schema (Embedded)

Defines the structure for educational qualifications.

*   **degree** (`String`, required, trimmed): The degree obtained.
*   **institution** (`String`, required, trimmed): The institution where the degree was obtained.
*   **year** (`String`, required, trimmed): The year of completion.
*   **specialization** (`String`, trimmed): The area of specialization.

### faculty Schema

Defines the main structure for a faculty member.

*   **name** (`String`, required, trimmed): The name of the faculty member.
*   **valid** (`Boolean`, default: `false`): A validation flag.
*   **designation** (`String`, required, trimmed): The faculty member's designation (e.g., "Professor", "Assistant Professor").
*   **expertise** (`Array` of `String`, trimmed): Areas of expertise.
*   **image** (`String`, trimmed): The URL or path to the faculty member's image.
*   **email** (`String`, required, trimmed, unique): The faculty member's email address.
*   **linkedin** (`String`, trimmed): URL to the faculty member's LinkedIn profile.
*   **biography** (`String`, required, trimmed): The faculty member's biography.
*   **education** (`Array` of `education Schema`): Embedded education documents.
*   **researchAreas** (`Array` of `String`, trimmed): Areas of research interest.
*   **phdStudents** (`Array` of `ObjectId`, ref: 'PhdStudent'): References to supervised PhD students (stores IDs).
*   **publications** (`Array` of `ObjectId`, ref: 'Publication`): References to publications (stores IDs).
*   **awards** (`Array` of `ObjectId`, ref: 'Award`): References to awards (stores IDs).
*   **researchProjects** (`Array` of `ObjectId`, ref: 'ResearchProject`): References to research projects (stores IDs).
*   **requests** (`Array` of embedded schemas): Not fully defined in the snippet, but seems to track change requests related to this faculty.
    *   **request** (`ObjectId`, ref: 'FacultyChangeRequest`): Reference to the change request document.
    *   **status** (`String`, enum: ['pending', 'approved', 'rejected'], default: 'pending'): The status of the request.
*   **timestamps** (`true`): Automatically adds `createdAt` and `updatedAt` fields.
*   **Virtuals**:
    *   **publicationsList**: Populates `Publication` documents based on the `authors` field.
    *   **phdStudentsList**: Populates `PhdStudent` documents based on the `supervisor` field.
    *   **awardsList**: Populates `Award` documents based on the `recipient` field.
    *   **researchProjectsList**: Populates `ResearchProject` documents based on the `principalInvestigator` field.

---

## People/studentCouncil.js (`backend/models/People/studentCouncil.js`)

This schema defines the structure for members of the student council.

*   **name** (`String`, required, trimmed): The name of the council member.
*   **designation** (`String`, required, trimmed): The council member's position (e.g., "President", "Secretary").
*   **image** (`String`, required, trimmed): The URL or path to the member's image.
*   **isDeleted** (`Boolean`, default: `false`): Flag for soft deletion.
*   **lastUpdated** (`Date`, default: `Date.now`): Timestamp for the last update.
*   **timestamps** (`true`): Automatically adds `createdAt` and `updatedAt` fields.

---

## People/btechStudents.js (`backend/models/People/btechStudents.js`)

This schema defines the structure for B.Tech student information.

*   **overview** (`String`, required, trimmed): Overview text for the B.Tech students page.
*   **timestamps** (`true`): Automatically adds `createdAt` and `updatedAt` fields.
    *(Note: This schema seems very basic and might only store an overview, not individual student details.)*

---

## People/administration.js (`backend/models/People/administration.js`)

This schema defines the structure for administration staff and departments.

### officer Schema (Embedded)

Defines the structure for administrative officers.

*   **name** (`String`, required, trimmed): The name of the officer.
*   **designation** (`String`, required, trimmed): The officer's designation.
*   **email** (`String`, required, trimmed, lowercase): The officer's email address.
*   **phone** (`String`, trimmed): The officer's phone number.
*   **image** (`String`, trimmed): The URL or path to the officer's image.
*   **order** (`Number`, default: 0): Order of display.
*   **isDeleted** (`Boolean`, default: `false`): Flag for soft deletion.

### department Schema (Embedded)

Defines the structure for administrative departments.

*   **name** (`String`, required, trimmed): The name of the department.
*   **description** (`String`, trimmed): Description of the department.
*   **contactEmail** (`String`, trimmed, lowercase): Contact email for the department.
*   **contactPhone** (`String`, trimmed): Contact phone for the department.
*   **isDeleted** (`Boolean`, default: `false`): Flag for soft deletion.

### AdministrationPage Schema

Defines the structure for the overall administration page content.

*   **overview** (`String`, required, trimmed): Overview text for the administration page.
*   **officers** (`Array` of `officer Schema`): Embedded administrative officer documents.
*   **departments** (`Array` of `department Schema`): Embedded administrative department documents.
*   **timestamps** (`true`): Automatically adds `createdAt` and `updatedAt` fields.

---

## People/alumni.js (`backend/models/People/alumni.js`)

This schema defines the structure for alumni information.

### testimonial Schema (Embedded)

Defines the structure for alumni testimonials.

*   **quote** (`String`, required, trimmed): The testimonial quote.
*   **author** (`String`, required, trimmed): The name of the alumnus/alumna.
*   **year** (`String`, trimmed): Graduation year or similar.
*   **image** (`String`, trimmed): The URL or path to the alumnus/alumna's image.
*   **isDeleted** (`Boolean`, default: `false`): Flag for soft deletion.

### AlumniPage Schema

Defines the structure for the overall alumni page content.

*   **overview** (`String`, required, trimmed): Overview text for the alumni page.
*   **sections** (`Array` of embedded schemas - not fully defined): Likely sections for different alumni-related content.
*   **events** (`Array` of embedded schemas - not fully defined): Likely information about alumni events.
*   **chapters** (`Array` of embedded schemas - not fully defined): Likely information about alumni chapters.
*   **testimonials** (`Array` of `testimonial Schema`): Embedded testimonial documents.
*   **galleryLinks** (`Array` of String): Links to alumni photo galleries.
*   **contactInfo** (`String`, trimmed): Contact information for the alumni association.
*   **timestamps** (`true`): Automatically adds `createdAt` and `updatedAt` fields.

---

## requests/facultyRequest.js (`backend/models/requests/facultyRequest.js`)

This schema defines the structure for faculty change requests.

### change Schema (Embedded)

Defines the structure for a specific change requested.

*   **field** (`String`, required, trimmed): The name of the field to be changed (e.g., "designation", "biography").
*   **oldValue** (`String`): The old value of the field.
*   **newValue** (`String`): The requested new value of the field.
*   **status** (`String`, enum: ['pending', 'approved', 'rejected'], default: 'pending'): The status of this specific change.
*   **notes** (`String`, trimmed): Any notes related to this change.

### FacultyChangeRequest Schema

Defines the structure for a faculty member's request to change their profile information.

*   **faculty** (`ObjectId`, ref: 'Faculty', required): Reference to the faculty member making the request.
*   **changes** (`Array` of `change Schema`): An array of embedded change schemas detailing the requested modifications.
*   **status** (`String`, enum: ['pending', 'approved', 'rejected', 'cancelled'], default: 'pending'): The overall status of the request.
*   **submittedAt** (`Date`, default: `Date.now`): The timestamp when the request was submitted.
*   **reviewedAt** (`Date`): The timestamp when the request was reviewed.
*   **reviewedBy** (`ObjectId`, ref: 'User`): Reference to the user who reviewed the request.
*   **adminNotes** (`String`, trimmed): Notes added by the administrator during review.
*   **timestamps** (`true`): Automatically adds `createdAt` and `updatedAt` fields.

---

## requests/placementRequest.js (`backend/models/requests/placementRequest.js`)

This schema defines the structure for placement-related requests (e.g., company registration, student updates).

*   **requestType** (`String`, required, enum: ['CompanyRegistration', 'StudentPlacementUpdate', 'Other']): The type of placement request.
*   **submittedBy** (`ObjectId`, ref: 'User`): Reference to the user who submitted the request (could be a student, company representative, etc.).
*   **companyDetails** (`Object`): Details about the company (if requestType is CompanyRegistration).
    *   **name** (`String`, required): Company name.
    *   **email** (`String`, required): Company email.
    *   **website** (`String`): Company website.
    *   **contactPerson** (`String`): Contact person name.
    *   **contactPhone** (`String`): Contact phone number.
    *   **address** (`String`): Company address.
    *   **description** (`String`): Company description.
*   **studentUpdateDetails** (`Object`): Details about the student placement update (if requestType is StudentPlacementUpdate).
    *   **student** (`ObjectId`, ref: 'User`): Reference to the student user.
    *   **companyName** (`String`, required): Name of the placed company.
    *   **jobTitle** (`String`, required): Job title.
    *   **salary** (`String`): Salary details.
    *   **year** (`String`): Placement year.
*   **otherDetails** (`String`, trimmed): Details for other request types.
*   **status** (`String`, enum: ['pending', 'approved', 'rejected'], default: 'pending'): The status of the request.
*   **adminNotes** (`String`, trimmed): Notes added by the administrator during review.
*   **timestamps** (`true`): Automatically adds `createdAt` and `updatedAt` fields.

---

## LifeAtIIITS/Hostel.js (`backend/models/LifeAtIIITS/Hostel.js`)

This schema defines the structure for hostel information.

*   **name** (`String`, required, trimmed): The name or identifier of the hostel (e.g., "Boys Hostel", "Girls Hostel").
*   **overview** (`String`, required, trimmed): Overview text about the hostel.
*   **sections** (`Array` of embedded schemas - not defined): Likely sections for different aspects of hostel life (rules, facilities, etc.).
*   **galleryLinks** (`Array` of String): Links to photo galleries of the hostel.
*   **isDeleted** (`Boolean`, default: `false`): Flag for soft deletion.
*   **lastUpdated** (`Date`, default: `Date.now`): Timestamp for the last update.
*   **timestamps** (`true`): Automatically adds `createdAt` and `updatedAt` fields.

---

## LifeAtIIITS/ClubsAndSocieties.js (`backend/models/LifeAtIIITS/ClubsAndSocieties.js`)

This schema defines the structure for information about clubs and societies.

### club Schema (Embedded)

Defines the structure for individual clubs or societies.

*   **name** (`String`, required, trimmed): The name of the club/society.
*   **description** (`String`, required, trimmed): Description of the club/society.
*   **advisorFaculty** (`ObjectId`, ref: 'Faculty`): Reference to the faculty advisor.
*   **studentHeads** (`Array` of String, trimmed): Names of student heads/coordinators.
*   **contactEmail** (`String`, trimmed, lowercase): Contact email for the club/society.
*   **logoUrl** (`String`, trimmed): URL to the club/society logo.
*   **galleryLinks** (`Array` of String): Links to photo galleries related to the club/society.
*   **isDeleted** (`Boolean`, default: `false`): Flag for soft deletion.

### ClubsAndSocietiesPage Schema

Defines the structure for the overall clubs and societies page content.

*   **overview** (`String`, required, trimmed): Overview text for the page.
*   **clubs** (`Array` of `club Schema`): Embedded club documents.
*   **timestamps** (`true`): Automatically adds `createdAt` and `updatedAt` fields.

---

## LifeAtIIITS/Events.js (`backend/models/LifeAtIIITS/Events.js`)

This schema defines the structure for events information.

### event Schema (Embedded)

Defines the structure for individual events.

*   **title** (`String`, required, trimmed): The title of the event.
*   **description** (`String`, required, trimmed): Description of the event.
*   **date** (`Date`, required): The date of the event.
*   **time** (`String`, trimmed): The time of the event.
*   **venue** (`String`, trimmed): The venue of the event.
*   **imageUrl** (`String`, trimmed): URL to an image for the event.
*   **linkUrl** (`String`, trimmed): A link for more information or registration.
*   **isDeleted** (`Boolean`, default: `false`): Flag for soft deletion.
*   **lastUpdated** (`Date`, default: `Date.now`): Timestamp for the last update.

### EventsPage Schema

Defines the structure for the overall events page content.

*   **overview** (`String`, required, trimmed): Overview text for the events page.
*   **events** (`Array` of `event Schema`): Embedded event documents.
*   **timestamps** (`true`): Automatically adds `createdAt` and `updatedAt` fields.

---

## LifeAtIIITS/Sports.js (`backend/models/LifeAtIIITS/Sports.js`)

This schema defines the structure for sports-related information.

### sport Schema (Embedded)

Defines the structure for individual sports or sports facilities.

*   **name** (`String`, required, trimmed): The name of the sport or facility.
*   **description** (`String`, required, trimmed): Description.
*   **iconUrl** (`String`, trimmed): URL to an icon for the sport/facility.
*   **isDeleted** (`Boolean`, default: `false`): Flag for soft deletion.

### SportsPage Schema

Defines the structure for the overall sports page content.

*   **overview** (`String`, required, trimmed): Overview text for the sports page.
*   **sports** (`Array` of `sport Schema`): Embedded sport documents.
*   **facilities** (`Array` of embedded schemas - not defined): Likely embedded schemas for sports facilities.
*   **achievements** (`Array` of embedded schemas - not defined): Likely embedded schemas for sports achievements.
*   **galleryLinks** (`Array` of String): Links to sports photo galleries.
*   **contactInfo** (`String`, trimmed): Contact information for the sports section.
*   **timestamps** (`true`): Automatically adds `createdAt` and `updatedAt` fields.

---

## LifeAtIIITS/Gallery.js (`backend/models/LifeAtIIITS/Gallery.js`)

This schema defines the structure for photo galleries.

### photo Schema (Embedded)

Defines the structure for individual photos in a gallery.

*   **imageUrl** (`String`, required, trimmed): The URL of the photo.
*   **caption** (`String`, trimmed): A caption for the photo.
*   **uploadDate** (`Date`, default: `Date.now`): The date the photo was uploaded.
*   **isDeleted** (`Boolean`, default: `false`): Flag for soft deletion.

### Gallery Schema

Defines the structure for a collection of photos (a gallery).

*   **name** (`String`, required, trimmed): The name of the gallery.
*   **description** (`String`, trimmed): Description of the gallery.
*   **photos** (`Array` of `photo Schema`): Embedded photo documents.
*   **eventDate** (`Date`): The date related to the gallery's event (if any).
*   **isDeleted** (`Boolean`, default: `false`): Flag for soft deletion.
*   **lastUpdated** (`Date`, default: `Date.now`): Timestamp for the last update.
*   **timestamps** (`true`): Automatically adds `createdAt` and `updatedAt` fields.

---

## LifeAtIIITS/MediaCoverage.js (`backend/models/LifeAtIIITS/MediaCoverage.js`)

This schema defines the structure for media coverage information.

### mediaItem Schema (Embedded)

Defines the structure for individual media coverage items.

*   **title** (`String`, required, trimmed): The title of the media coverage.
*   **source** (`String`, required, trimmed): The media source (e.g., "Times of India").
*   **publishDate** (`Date`, required): The date of publication/broadcast.
*   **linkUrl** (`String`, required, trimmed): The URL to the media coverage.
*   **isDeleted** (`Boolean`, default: `false`): Flag for soft deletion.

### MediaCoveragePage Schema

Defines the structure for the overall media coverage page content.

*   **overview** (`String`, required, trimmed): Overview text for the page.
*   **mediaItems** (`Array` of `mediaItem Schema`): Embedded media item documents.
*   **timestamps** (`true`): Automatically adds `createdAt` and `updatedAt` fields.

---

## LifeAtIIITS/CampusLife.js (`backend/models/LifeAtIIITS/CampusLife.js`)

This schema defines the structure for general campus life information.

### section Schema (Embedded)

Defines the structure for a section of content on the campus life page.

*   **title** (`String`, required, trimmed): The title of the section.
*   **content** (`String`, required, trimmed): The content of the section (can be HTML/markdown).
*   **imageUrl** (`String`, trimmed): An optional image URL for the section.
*   **order** (`Number`, default: 0): Display order of the section.
*   **isDeleted** (`Boolean`, default: `false`): Flag for soft deletion.

### CampusLifePage Schema

Defines the structure for the overall campus life page content.

*   **overview** (`String`, required, trimmed): Overview text for the campus life page.
*   **sections** (`Array` of `section Schema`): Embedded section documents.
*   **galleryLinks** (`Array` of String): Links to campus life photo galleries.
*   **contactInfo** (`String`, trimmed): Contact information for campus life inquiries.
*   **timestamps** (`true`): Automatically adds `createdAt` and `updatedAt` fields.

---

## research/publication.js (`backend/models/research/publication.js`)

This schema defines the structure for research publications.

*   **title** (`String`, required, trimmed): The title of the publication.
*   **journal** (`String`, trimmed): The journal or conference where published.
*   **date** (`Date`, required): The publication date.
*   **link** (`String`, trimmed): A link to the publication (e.g., on a publisher's site or repository).
*   **doi** (`String`, trimmed): The Digital Object Identifier.
*   **authors** (`Array` of `ObjectId`, ref: 'Faculty`, required): References to the faculty authors.
*   **authorType** (`String`, required, enum: ['Faculty', 'Student', 'Other']): Indicates the type of authors.
*   **timestamps** (`true`): Automatically adds `createdAt` and `updatedAt` fields.

---

## research/fellowship.js (`backend/models/research/fellowship.js`)

This schema defines the structure for research fellowships.

### fellowshipItem Schema (Embedded)

Defines the structure for individual fellowship listings.

*   **title** (`String`, required, trimmed): The title of the fellowship.
*   **description** (`String`, required, trimmed): Description of the fellowship.
*   **eligibility** (`String`, required, trimmed): Eligibility criteria.
*   **benefits** (`String`, required, trimmed): Benefits of the fellowship.
*   **duration** (`String`, required, trimmed): Duration of the fellowship.
*   **applicationProcess** (`String`, required, trimmed): Steps for applying.
*   **deadline** (`Date`): Application deadline.
*   **linkUrl** (`String`, trimmed): A link for more information or application.
*   **isDeleted** (`Boolean`, default: `false`): Flag for soft deletion.
*   **lastUpdated** (`Date`, default: `Date.now`): Timestamp for the last update.

### FellowshipPage Schema

Defines the structure for the overall fellowships page content.

*   **overview** (`String`, required, trimmed): Overview text for the fellowships page.
*   **fellowships** (`Array` of `fellowshipItem Schema`): Embedded fellowship listing documents.
*   **timestamps** (`true`): Automatically adds `createdAt` and `updatedAt` fields.

---

## research/news.js (`backend/models/research/news.js`)

This schema defines the structure for research news articles.

*   **title** (`String`, required, trimmed): The title of the news article.
*   **content** (`String`, required, trimmed): The content of the news article.
*   **publishDate** (`Date`, required, default: `Date.now`): The date the article was published.
*   **imageUrl** (`String`, trimmed): An optional image URL for the article.
*   **author** (`String`, trimmed): The author of the news article.
*   **isDeleted** (`Boolean`, default: `false`): Flag for soft deletion.
*   **lastUpdated** (`Date`, default: `Date.now`): Timestamp for the last update.
*   **timestamps** (`true`): Automatically adds `createdAt` and `updatedAt` fields.

---

## research/researchProject.js (`backend/models/research/researchProject.js`)

This schema defines the structure for research projects.

*   **title** (`String`, required, trimmed): The title of the research project.
*   **description** (`String`, required, trimmed): Description of the project.
*   **principalInvestigator** (`Array` of `ObjectId`, ref: 'Faculty`, required): References to the principal investigator(s) (Faculty).
*   **funding** (`Object`): Funding details.
    *   **agency** (`String`, required, trimmed): Funding agency.
    *   **amount** (`String`, required, trimmed): Funding amount.
*   **startDate** (`Date`): Project start date.
*   **endDate** (`Date`): Project end date.
*   **projectType** (`String`, required, enum: ['Faculty', 'Student', 'Collaborative', 'Other']): Type of project.
*   **timestamps** (`true`): Automatically adds `createdAt` and `updatedAt` fields.

---

## research/award.js (`backend/models/research/award.js`)

This schema defines the structure for research awards and recognition.

*   **name** (`String`, required, trimmed): The name of the award.
*   **organization** (`String`, trimmed): The organization that granted the award.
*   **year** (`String`, trimmed): The year the award was received.
*   **date** (`Date`): The exact date the award was received.
*   **description** (`String`, trimmed): Description of the award.
*   **recipient** (`Array` of `ObjectId`, ref: 'Faculty`, required): References to the faculty recipients.
*   **awardType** (`String`, required, enum: ['Faculty', 'Student', 'Other']): Indicates the type of recipient.
*   **timestamps** (`true`): Automatically adds `createdAt` and `updatedAt` fields.

---

## placement/contact.js (`backend/models/placement/contact.js`)

This schema defines the structure for placement contact information.

### person Schema (Embedded)

Defines the structure for a contact person in the placement cell.

*   **name** (`String`, required, trimmed): The name of the contact person.
*   **designation** (`String`, required, trimmed): The person's designation.
*   **email** (`String`, required, trimmed, lowercase): The person's email address.
*   **phone** (`String`, trimmed): The person's phone number.
*   **image** (`String`, trimmed): The URL or path to the person's image.
*   **order** (`Number`, default: 0): Display order.
*   **isDeleted** (`Boolean`, default: `false`): Flag for soft deletion.

### section Schema (Embedded)

Defines a general contact section with title and content.

*   **title** (`String`, required, trimmed): Title of the section.
*   **content** (`String`, required, trimmed): Content (e.g., address, map iframe).
*   **isDeleted** (`Boolean`, default: `false`): Flag for soft deletion.

### PlacementContact Schema

Defines the structure for the overall placement contact page content.

*   **overview** (`String`, required, trimmed): Overview text for the page.
*   **contactPersons** (`Array` of `person Schema`): Embedded contact person documents.
*   **sections** (`Array` of `section Schema`): Embedded contact section documents.
*   **timestamps** (`true`): Automatically adds `createdAt` and `updatedAt` fields.

---

## placement/statistics.js (`backend/models/placement/statistics.js`)

This schema defines the structure for placement statistics.

### statisticItem Schema (Embedded)

Defines the structure for individual statistics (e.g., highest salary, average salary).

*   **year** (`String`, required, trimmed): Academic year (e.g., "2022-23").
*   **highestSalary** (`String`, trimmed): Highest package/salary.
*   **averageSalary** (`String`, trimmed): Average package/salary.
*   **placementPercentage** (`String`, trimmed): Placement percentage.
*   **numCompaniesVisited** (`Number`): Number of companies visited.
*   **numStudentsPlaced** (`Number`): Number of students placed.
*   **isDeleted** (`Boolean`, default: `false`): Flag for soft deletion.

### PlacementStatistics Schema

Defines the structure for the overall placement statistics page content.

*   **overview** (`String`, required, trimmed): Overview text for the statistics page.
*   **statistics** (`Array` of `statisticItem Schema`): Embedded statistic item documents.
*   **timestamps** (`true`): Automatically adds `createdAt` and `updatedAt` fields.

---

## placement/achievements.js (`backend/models/placement/achievements.js`)

This schema defines the structure for placement achievements.

### achievementItem Schema (Embedded)

Defines the structure for individual placement achievements (e.g., notable placements, records).

*   **year** (`String`, required, trimmed): Academic year.
*   **description** (`String`, required, trimmed): Description of the achievement.
*   **isDeleted** (`Boolean`, default: `false`): Flag for soft deletion.

### PlacementAchievements Schema

Defines the structure for the overall placement achievements page content.

*   **overview** (`String`, required, trimmed): Overview text for the achievements page.
*   **achievements** (`Array` of `achievementItem Schema`): Embedded achievement item documents.
*   **timestamps** (`true`): Automatically adds `createdAt` and `updatedAt` fields.

---

## placement/placementprocess.js (`backend/models/placement/placementprocess.js`)

This schema defines the structure for the placement process information.

### step Schema (Embedded)

Defines the structure for a step in the placement process.

*   **title** (`String`, required, trimmed): The title of the step.
*   **description** (`String`, required, trimmed): Description of the step.
*   **order** (`Number`, default: 0): Display order.
*   **isDeleted** (`Boolean`, default: `false`): Flag for soft deletion.

### PlacementProcess Schema

Defines the structure for the overall placement process page content.

*   **overview** (`String`, required, trimmed): Overview text for the placement process page.
*   **steps** (`Array` of `step Schema`): Embedded step documents.
*   **timestamps** (`true`): Automatically adds `createdAt` and `updatedAt` fields.

---

## placement/recruiters.js (`backend/models/placement/recruiters.js`)

This schema defines the structure for information about recruiters.

### recruiter Schema (Embedded)

Defines the structure for individual recruiting companies.

*   **name** (`String`, required, trimmed): The name of the company.
*   **logoUrl** (`String`, required, trimmed): URL to the company logo.
*   **websiteUrl** (`String`, trimmed): Company website URL.
*   **year** (`String`, trimmed): Year(s) the company recruited.
*   **isDeleted** (`Boolean`, default: `false`): Flag for soft deletion.

### RecruiterCategory Schema (Embedded)

Defines a category for recruiters (e.g., "Past Recruiters", "Dream Companies").

*   **name** (`String`, required, trimmed): The name of the category.
*   **recruiters** (`Array` of `recruiter Schema`): Embedded recruiter documents within this category.
*   **isDeleted** (`Boolean`, default: `false`): Flag for soft deletion.

### PlacementRecruiters Schema

Defines the structure for the overall recruiters page content.

*   **overview** (`String`, required, trimmed): Overview text for the recruiters page.
*   **categories** (`Array` of `RecruiterCategory Schema`): Embedded recruiter category documents.
*   **timestamps** (`true`): Automatically adds `createdAt` and `updatedAt` fields.

---

## admissions/phd.js (`backend/models/admissions/phd.js`)

This schema defines the structure for PhD admission information.

*   **overview** (`String`, required, trimmed): Overview text for PhD admissions.
*   **eligibility** (`String`, required, trimmed): Eligibility criteria for PhD programs.
*   **howToApply** (`String`, required, trimmed): Instructions on how to apply.
*   **selectionProcess** (`String`, required, trimmed): Description of the selection process.
*   **importantDates** (`String`, trimmed): Information about important dates.
*   **contactInfo** (`String`, trimmed): Contact information for PhD admissions.
*   **timestamps** (`true`): Automatically adds `createdAt` and `updatedAt` fields.

---

## admissions/btech.js (`backend/models/admissions/btech.js`)

This schema defines the structure for B.Tech admission information.

### section Schema (Embedded)

Defines a section of content for the B.Tech admissions page.

*   **title** (`String`, required, trimmed): Title of the section.
*   **content** (`String`, required, trimmed): Content of the section (can be HTML/markdown).
*   **order** (`Number`, default: 0): Display order.
*   **isDeleted** (`Boolean`, default: `false`): Flag for soft deletion.

### BTechAdmission Schema

Defines the structure for the overall B.Tech admissions page content.

*   **overview** (`String`, required, trimmed): Overview text for B.Tech admissions.
*   **sections** (`Array` of `section Schema`): Embedded section documents.
*   **galleryLinks** (`Array` of String): Links to photo galleries related to B.Tech admissions.
*   **contactInfo** (`String`, trimmed): Contact information for B.Tech admissions.
*   **timestamps** (`true`): Automatically adds `createdAt` and `updatedAt` fields.

---

## admissions/helpline.js (`backend/models/admissions/helpline.js`)

This schema defines the structure for the admission helpline information.

### contactPerson Schema (Embedded)

Defines a contact person for the helpline.

*   **name** (`String`, required, trimmed): Name of the contact person.
*   **designation** (`String`, trimmed): Designation.
*   **phone** (`String`, required, trimmed): Phone number.
*   **email** (`String`, required, trimmed, lowercase): Email address.
*   **availability** (`String`, trimmed): Availability information.
*   **isDeleted** (`Boolean`, default: `false`): Flag for soft deletion.

### HelplinePage Schema

Defines the structure for the overall admission helpline page content.

*   **overview** (`String`, required, trimmed): Overview text for the page.
*   **contactPersons** (`Array` of `contactPerson Schema`): Embedded contact person documents.
*   **generalContact** (`Object`): General contact details.
    *   **phone** (`String`, required, trimmed): General phone number.
    *   **email** (`String`, required, trimmed, lowercase): General email address.
    *   **address** (`String`, trimmed): Address.
*   **importantLinks** (`Array` of embedded schemas - not defined): Likely links to relevant admission pages.
*   **timestamps** (`true`): Automatically adds `createdAt` and `updatedAt` fields.

---

## admissions/overview.js (`backend/models/admissions/overview.js`)

This schema defines the structure for the general admissions overview.

### section Schema (Embedded)

Defines a section of content for the admissions overview page.

*   **title** (`String`, required, trimmed): Title of the section.
*   **content** (`String`, required, trimmed): Content of the section (can be HTML/markdown).
*   **order** (`Number`, default: 0): Display order.
*   **isDeleted** (`Boolean`, default: `false`): Flag for soft deletion.

### AdmissionsOverview Schema

Defines the structure for the overall admissions overview page content.

*   **overview** (`String`, required, trimmed): Main overview text.
*   **sections** (`Array` of `section Schema`): Embedded section documents.
*   **btechAdmissionLink** (`String`, trimmed): Link to B.Tech admission page.
*   **phdAdmissionLink** (`String`, trimmed): Link to PhD admission page.
*   **dasaAdmissionLink** (`String`, trimmed): Link to DASA admission page.
*   **notificationsLink** (`String`, trimmed): Link to admission notifications page.
*   **helplineLink** (`String`, trimmed): Link to admission helpline page.
*   **feeStructureLink** (`String`, trimmed): Link to fee structure page.
*   **galleryLinks** (`Array` of String): Links to relevant photo galleries.
*   **contactInfo** (`String`, trimmed): General admission contact info.
*   **timestamps** (`true`): Automatically adds `createdAt` and `updatedAt` fields.

---

## admissions/notifications.js (`backend/models/admissions/notifications.js`)

This schema defines the structure for admission notifications.

### notification Schema (Embedded)

Defines the structure for individual admission notifications.

*   **title** (`String`, required, trimmed): The title of the notification.
*   **fileUrl** (`String`, required, trimmed): The URL to the notification file (e.g., PDF).
*   **publishDate** (`Date`, required, default: `Date.now`): The date the notification was published.
*   **isDeleted** (`Boolean`, default: `false`): Flag for soft deletion.
*   **lastUpdated** (`Date`, default: `Date.now`): Timestamp for the last update.

### AdmissionsNotifications Schema

Defines the structure for the overall admission notifications page content.

*   **overview** (`String`, required, trimmed): Overview text for the page.
*   **notifications** (`Array` of `notification Schema`): Embedded notification documents.
*   **timestamps** (`true`): Automatically adds `createdAt` and `updatedAt` fields.

---

## Academics/program.js (`backend/models/Academics/program.js`)

This schema defines the structure for academic programs offered by the institute.

*   **title** (`String`, required, trimmed): The full title of the academic program (e.g., "Bachelor of Technology").
*   **description** (`String`, required, trimmed): A description of the program.
*   **level** (`String`, required, enum: ['Undergraduate', 'Postgraduate', 'Doctorate'], trimmed): The level of the program.
*   **duration** (`String`, required, trimmed): The duration of the program (e.g., "4 Years").
*   **seats** (`Number`, required, min: 0): The number of available seats.
*   **eligibility** (`String`, required, trimmed): Eligibility criteria for the program.
*   **isActive** (`Boolean`, default: `true`): Flag indicating if the program is currently active.
*   **isDeleted** (`Boolean`, default: `false`): Flag for soft deletion.
*   **lastUpdated** (`Date`, default: `Date.now`): Timestamp for the last update.
*   **timestamps** (`true`): Automatically adds `createdAt` and `updatedAt` fields.

---

## Academics/result.js (`backend/models/Academics/result.js`)

This schema defines the structure for academic results documents.

*   **program** (`ObjectId`, ref: 'Program', required): Reference to the academic program the result belongs to.
*   **academicYear** (`String`, required, trimmed): The academic year (e.g., "2023-24").
*   **semester** (`String`, required, trimmed): The semester (e.g., "Odd Semester", "Even Semester").
*   **fileUrl** (`String`, required, trimmed): The URL to the result document file (e.g., PDF).
*   **fileName** (`String`, required, trimmed): The name of the result file.
*   **uploadDate** (`Date`, default: `Date.now`): The date the result was uploaded.
*   **isDeleted** (`Boolean`, default: `false`): Flag for soft deletion.
*   **lastUpdated** (`Date`, default: `Date.now`): Timestamp for the last update.
*   **timestamps** (`true`): Automatically adds `createdAt` and `updatedAt` fields.

---

## Academics/syllabus.js (`backend/models/Academics/syllabus.js`)

This schema defines the structure for syllabus documents.

*   **program** (`ObjectId`, ref: 'Program', required): Reference to the academic program the syllabus belongs to.
*   **fileUrl** (`String`, required, trimmed): The URL to the syllabus document file (e.g., PDF).
*   **fileName** (`String`, required, trimmed): The name of the syllabus file.
*   **uploadDate** (`Date`, default: `Date.now`): The date the syllabus was uploaded.
*   **isDeleted** (`Boolean`, default: `false`): Flag for soft deletion.
*   **lastUpdated** (`Date`, default: `Date.now`): Timestamp for the last update.
*   **timestamps** (`true`): Automatically adds `createdAt` and `updatedAt` fields.

---

## Academics/departments.js (`backend/models/Academics/departments.js`)

This schema defines the structure for academic departments.

### program Schema (Embedded - Note: This is an embedded schema within Departments, distinct from the top-level Program schema)

Defines a program listing within a department's context.

*   **name** (`String`, required, trimmed): Name of the program under this department.
*   **description** (`String`, trimmed): Description of the program.
*   **linkUrl** (`String`, trimmed): Link to the program details page.
*   **isDeleted** (`Boolean`, default: `false`): Flag for soft deletion.

### Department Schema

Defines the structure for an academic department.

*   **name** (`String`, required, trimmed): The name of the department (e.g., "Computer Science and Engineering").
*   **overview** (`String`, required, trimmed): Overview text for the department.
*   **headOfDepartment** (`ObjectId`, ref: 'Faculty`): Reference to the Head of Department faculty member.
*   **programsOffered** (`Array` of `program Schema`): Embedded program listings within the department.
*   **contactEmail** (`String`, trimmed, lowercase): Department contact email.
*   **contactPhone** (`String`, trimmed): Department contact phone.
*   **isDeleted** (`Boolean`, default: `false`): Flag for soft deletion.
*   **lastUpdated** (`Date`, default: `Date.now`): Timestamp for the last update.
*   **timestamps** (`true`): Automatically adds `createdAt` and `updatedAt` fields.

---

## Academics/holiday.js (`backend/models/Academics/holiday.js`)

This schema defines the structure for holiday lists.

### holidayItem Schema (Embedded)

Defines an individual holiday.

*   **name** (`String`, required, trimmed): The name of the holiday.
*   **date** (`Date`, required): The date of the holiday.
*   **description** (`String`, trimmed): Optional description.
*   **isDeleted** (`Boolean`, default: `false`): Flag for soft deletion.

### HolidayList Schema

Defines the structure for an academic year's holiday list.

*   **academicYear** (`String`, required, trimmed): The academic year (e.g., "2023-24").
*   **holidays** (`Array` of `holidayItem Schema`): Embedded holiday documents.
*   **fileUrl** (`String`, trimmed): Optional URL to a downloadable holiday list file.
*   **isDeleted** (`Boolean`, default: `false`): Flag for soft deletion.
*   **lastUpdated** (`Date`, default: `Date.now`): Timestamp for the last update.
*   **timestamps** (`true`): Automatically adds `createdAt` and `updatedAt` fields.

---

## Academics/fee.js (`backend/models/Academics/fee.js`)

This schema defines the structure for fee information.

### feeCategory Schema (Embedded)

Defines a category of fees (e.g., "Tuition Fee", "Hostel Fee").

*   **name** (`String`, required, trimmed): The name of the fee category.
*   **description** (`String`, trimmed): Description of the fee category.
*   **isDeleted** (`Boolean`, default: `false`): Flag for soft deletion.

### feeItem Schema (Embedded)

Defines a specific fee item within a category.

*   **description** (`String`, required, trimmed): Description of the fee item (e.g., "Per Semester").
*   **amount** (`String`, required, trimmed): The fee amount (e.g., "₹ 1,50,000").
*   **isDeleted** (`Boolean`, default: `false`): Flag for soft deletion.

### FeeStructure Schema

Defines the structure for the overall fee structure.

*   **academicYear** (`String`, required, trimmed): The academic year the structure applies to.
*   **overview** (`String`, required, trimmed): Overview text about the fee structure and payment.
*   **categories** (`Array` of `feeCategory Schema`): Embedded fee category documents.
*   **feeItems** (`Array` of `feeItem Schema`): Embedded fee item documents (seems like fee items might also be standalone or within categories). *(Note: Schema structure might need clarification here if feeItems should always be nested within categories).*
*   **paymentMethods** (`String`, trimmed): Description of accepted payment methods.
*   **contactInfo** (`String`, trimmed): Contact information for fee-related inquiries.
*   **isDeleted** (`Boolean`, default: `false`): Flag for soft deletion.
*   **lastUpdated** (`Date`, default: `Date.now`): Timestamp for the last update.
*   **timestamps** (`true`): Automatically adds `createdAt` and `updatedAt` fields.

---

## Academics/calender.js (`backend/models/Academics/calender.js`)

This schema defines the structure for the academic calendar.

### event Schema (Embedded)

Defines an event or period in the academic calendar.

*   **title** (`String`, required, trimmed): The title of the event/period (e.g., "Mid-Semester Exams").
*   **startDate** (`Date`, required): The start date.
*   **endDate** (`Date`): The end date.
*   **description** (`String`, trimmed): Description.
*   **isDeleted** (`Boolean`, default: `false`): Flag for soft deletion.

### AcademicCalendar Schema

Defines the structure for an academic year's calendar.

*   **academicYear** (`String`, required, trimmed): The academic year.
*   **overview** (`String`, trimmed): Overview text for the calendar.
*   **events** (`Array` of `event Schema`): Embedded event documents.
*   **fileUrl** (`String`, trimmed): Optional URL to a downloadable calendar file.
*   **isDeleted** (`Boolean`, default: `false`): Flag for soft deletion.
*   **lastUpdated** (`Date`, default: `Date.now`): Timestamp for the last update.
*   **timestamps** (`true`): Automatically adds `createdAt` and `updatedAt` fields.

---

## Academics/nadModel.js (`backend/models/Academics/nadModel.js`)

This schema defines the structure for National Academic Depository (NAD) information.

*   **overview** (`String`, required, trimmed): Overview text for the NAD page.
*   **howToRegister** (`String`, required, trimmed): Instructions on how to register on NAD.
*   **benefits** (`String`, required, trimmed): Benefits of using NAD.
*   **linkUrl** (`String`, trimmed): A link to the NAD portal.
*   **timestamps** (`true`): Automatically adds `createdAt` and `updatedAt` fields.

---

## Academics/nssModel.js (`backend/models/Academics/nssModel.js`)

This schema defines the structure for National Service Scheme (NSS) information.

### activity Schema (Embedded)

Defines an NSS activity or event.

*   **title** (`String`, required, trimmed): Title of the activity.
*   **description** (`String`, required, trimmed): Description.
*   **date** (`Date`): Date of the activity.
*   **imageUrl** (`String`, trimmed): Image URL.
*   **isDeleted** (`Boolean`, default: `false`): Flag for soft deletion.

### NSSPage Schema

Defines the structure for the overall NSS page content.

*   **overview** (`String`, required, trimmed): Overview text for the NSS page.
*   **activities** (`Array` of `activity Schema`): Embedded activity documents.
*   **galleryLinks** (`Array` of String): Links to NSS photo galleries.
*   **contactInfo** (`String`, trimmed): Contact information for NSS.
*   **timestamps** (`true`): Automatically adds `createdAt` and `updatedAt` fields.

---

## Academics/antiRaggingModel.js (`backend/models/Academics/antiRaggingModel.js`)

This schema defines the structure for anti-ragging information.

### contact Schema (Embedded)

Defines a contact person or helpline for anti-ragging.

*   **name** (`String`, required, trimmed): Name of the contact.
*   **designation** (`String`, trimmed): Designation.
*   **phone** (`String`, required, trimmed): Phone number.
*   **email** (`String`, required, trimmed, lowercase): Email address.
*   **isDeleted** (`Boolean`, default: `false`): Flag for soft deletion.

### AntiRaggingPage Schema

Defines the structure for the overall anti-ragging page content.

*   **overview** (`String`, required, trimmed): Overview text for the page.
*   **policy** (`String`, required, trimmed): The anti-ragging policy text.
*   **contacts** (`Array` of `contact Schema`): Embedded contact documents.
*   **helplineNumber** (`String`, trimmed): Dedicated helpline number.
*   **complaintProcedure** (`String`, trimmed): Description of the complaint procedure.
*   **timestamps** (`true`): Automatically adds `createdAt` and `updatedAt` fields.

---

## Academics/iicModel.js (`backend/models/Academics/iicModel.js`)

This schema defines the structure for the Institute Innovation Council (IIC) information.

*   **overview** (`String`, required, trimmed): Overview text for the IIC page.
*   **members** (`Array` of embedded schemas - not defined): Likely embedded schemas for IIC members.
*   **activities** (`Array` of embedded schemas - not defined): Likely embedded schemas for IIC activities.
*   **contactInfo** (`String`, trimmed): Contact information for IIC.
*   **timestamps** (`true`): Automatically adds `createdAt` and `updatedAt` fields.

---

## About/senate.js (`backend/models/About/senate.js`)

This schema defines the structure for the Senate information.

*   **overview** (`String`, required, trimmed): Overview text about the Senate.
*   **members** (`Array` of embedded schemas - not defined): Likely embedded schemas for Senate members.
*   **timestamps** (`true`): Automatically adds `createdAt and `updatedAt` fields.

---

## About/procurement.js (`backend/models/About/procurement.js`)

This schema defines the structure for procurement information.

### document Schema (Embedded)

Defines a downloadable procurement-related document.

*   **title** (`String`, required, trimmed): Title of the document.
*   **fileUrl** (`String`, required, trimmed): URL to the document file.
*   **publishDate** (`Date`, default: `Date.now`): Publish date.
*   **isDeleted** (`Boolean`, default: `false`): Flag for soft deletion.
*   **lastUpdated** (`Date`, default: `Date.now`): Timestamp for last update.

### ProcurementPage Schema

Defines the structure for the overall procurement page content.

*   **overview** (`String`, required, trimmed): Overview text for the page.
*   **documents** (`Array` of `document Schema`): Embedded document schemas.
*   **timestamps** (`true`): Automatically adds `createdAt` and `updatedAt` fields.

---

## About/auditandaccount.js (`backend/models/About/auditandaccount.js`)

This schema defines the structure for audit and account information.

### document Schema (Embedded)

Defines a downloadable audit or account document.

*   **title** (`String`, required, trimmed): Title of the document.
*   **fileUrl** (`String`, required, trimmed): URL to the document file.
*   **publishDate** (`Date`, default: `Date.now`): Publish date.
*   **isDeleted** (`Boolean`, default: `false`): Flag for soft deletion.
*   **lastUpdated** (`Date`, default: `Date.now`): Timestamp for last update.

### AuditAndAccountPage Schema

Defines the structure for the overall audit and account page content.

*   **overview** (`String`, required, trimmed): Overview text for the page.
*   **documents** (`Array` of `document Schema`): Embedded document schemas.
*   **timestamps** (`true`): Automatically adds `createdAt` and `updatedAt` fields.

---

## About/rti.js (`backend/models/About/rti.js`)

This schema defines the structure for Right to Information (RTI) information.

### official Schema (Embedded)

Defines a contact person for RTI requests.

*   **name** (`String`, required, trimmed): Name.
*   **designation** (`String`, trimmed): Designation.
*   **phone** (`String`, trimmed): Phone number.
*   **email** (`String`, required, trimmed, lowercase): Email address.
*   **isDeleted** (`Boolean`, default: `false`): Flag for soft deletion.

### document Schema (Embedded)

Defines a downloadable RTI-related document.

*   **title** (`String`, required, trimmed): Title of the document.
*   **fileUrl** (`String`, required, trimmed): URL to the document file.
*   **publishDate** (`Date`, default: `Date.now`): Publish date.
*   **isDeleted** (`Boolean`, default: `false`): Flag for soft deletion.

### RTIPage Schema

Defines the structure for the overall RTI page content.

*   **overview** (`String`, required, trimmed): Overview text for the page.
*   **officials** (`Array` of `official Schema`): Embedded official documents.
*   **documents** (`Array` of `document Schema`): Embedded document schemas.
*   **howToFileRequest** (`String`, trimmed): Description of how to file an RTI request.
*   **feeDetails** (`String`, trimmed): Details about fees for RTI requests.
*   **timestamps** (`true`): Automatically adds `createdAt` and `updatedAt` fields.

---

## About/acts.js (`backend/models/About/acts.js`)

This schema defines the structure for Acts, Statutes, and Ordinances.

### document Schema (Embedded)

Defines a downloadable document (Act, Statute, or Ordinance).

*   **title** (`String`, required, trimmed): Title of the document.
*   **fileUrl** (`String`, required, trimmed): URL to the document file.
*   **publishDate** (`Date`, default: `Date.now`): Publish date.
*   **isDeleted** (`Boolean`, default: `false`): Flag for soft deletion.
*   **lastUpdated** (`Date`, default: `Date.now`): Timestamp for last update.

### ActsStatutesOrdinances Schema

Defines the structure for the overall page content.

*   **overview** (`String`, required, trimmed): Overview text for the page.
*   **documents** (`Array` of `document Schema`): Embedded document schemas.
*   **timestamps** (`true`): Automatically adds `createdAt` and `updatedAt` fields.

---

## About/orders.js (`backend/models/About/orders.js`)

This schema defines the structure for office orders.

### order Schema (Embedded)

Defines a downloadable office order document.

*   **title** (`String`, required, trimmed): Title of the order.
*   **fileUrl** (`String`, required, trimmed): URL to the order file.
*   **publishDate** (`Date`, default: `Date.now`): Publish date.
*   **isDeleted** (`Boolean`, default: `false`): Flag for soft deletion.
*   **lastUpdated** (`Date`, default: `Date.now`): Timestamp for last update.

### OfficeOrdersPage Schema

Defines the structure for the overall office orders page content.

*   **overview** (`String`, required, trimmed): Overview text for the page.
*   **orders** (`Array` of `order Schema`): Embedded order documents.
*   **timestamps** (`true`): Automatically adds `createdAt` and `updatedAt` fields.

---

## About/annualReport.js (`backend/models/About/annualReport.js`)

This schema defines the structure for annual reports.

*   **year** (`String`, required, trimmed): The year of the annual report (e.g., "2022-23").
*   **fileUrl** (`String`, required, trimmed): The URL to the annual report file.
*   **publishDate** (`Date`, default: `Date.now`): The date the report was published.
*   **isDeleted** (`Boolean`, default: `false`): Flag for soft deletion.
*   **lastUpdated** (`Date`, default: `Date.now`): Timestamp for the last update.
*   **timestamps** (`true`): Automatically adds `createdAt` and `updatedAt` fields.

---

## About/financeCommittee.js (`backend/models/About/financeCommittee.js`)

This schema defines the structure for the Finance Committee information.

*   **overview** (`String`, required, trimmed): Overview text about the Finance Committee.
*   **members** (`Array` of embedded schemas - not defined): Likely embedded schemas for committee members.
*   **timestamps** (`true`): Automatically adds `createdAt` and `updatedAt` fields.

---

## About/governors.js (`backend/models/About/governors.js`)

This schema defines the structure for the Board of Governors information.

*   **overview** (`String`, required, trimmed): Overview text about the Board of Governors.
*   **members** (`Array` of embedded schemas - not defined): Likely embedded schemas for board members.
*   **timestamps** (`true`): Automatically adds `createdAt` and `updatedAt` fields.

---

## About/director.js (`backend/models/About/director.js`)

This schema defines the structure for the Director's profile information.

*   **name** (`String`, required, trimmed): The Director's name.
*   **designation** (`String`, required, trimmed): The Director's designation.
*   **image** (`String`, required, trimmed): The URL or path to the Director's image.
*   **biography** (`String`, required, trimmed): The Director's biography.
*   **message** (`String`, trimmed): A message from the Director.
*   **timestamps** (`true`): Automatically adds `createdAt` and `updatedAt` fields.

---

## About/strategic.js (`backend/models/About/strategic.js`)

This schema defines the structure for the Strategic Perspective information.

*   **overview** (`String`, required, trimmed): Overview text about the Strategic Perspective.
*   **sections** (`Array` of embedded schemas - not defined): Likely embedded schemas for different sections of the strategic plan.
*   **timestamps** (`true`): Automatically adds `createdAt` and `updatedAt` fields.

---

## About/vision.js (`backend/models/About/vision.js`)

This schema defines the structure for Vision and Mission information.

### section Schema (Embedded)

Defines a section of content for the Vision and Mission page.

*   **title** (`String`, required, trimmed): Title of the section (e.g., "Our Vision", "Our Mission").
*   **content** (`String`, required, trimmed): The content of the section.
*   **order** (`Number`, default: 0): Display order.
*   **isDeleted** (`Boolean`, default: `false`): Flag for soft deletion.

### VisionAndMission Schema

Defines the structure for the overall Vision and Mission page content.

*   **overview** (`String`, trimmed): Optional overview text.
*   **sections** (`Array` of `section Schema`): Embedded section documents.
*   **timestamps** (`true`): Automatically adds `createdAt` and `updatedAt` fields.

---

## About/about.js (`backend/models/About/about.js`)

This schema defines the structure for the general "About Us" information.

*   **overview** (`String`, required, trimmed): The main overview text for the "About Us" page.
*   **history** (`String`, trimmed): Information about the institute's history.
*   **infrastructure** (`String`, trimmed): Information about the institute's infrastructure.
*   **culture** (`String`, trimmed): Information about the institute's culture.
*   **timestamps** (`true`): Automatically adds `createdAt` and `updatedAt` fields.

---

## About/reports.js (`backend/models/About/reports.js`)

This schema defines the structure for downloadable reports (excluding Annual Reports, which have their own schema).

### report Schema (Embedded)

Defines a downloadable report document.

*   **title** (`String`, required, trimmed): Title of the report.
*   **fileUrl** (`String`, required, trimmed): URL to the report file.
*   **publishDate** (`Date`, default: `Date.now`): Publish date.
*   **isDeleted** (`Boolean`, default: `false`): Flag for soft deletion.
*   **lastUpdated** (`Date`, default: `Date.now`): Timestamp for last update.

### OtherReports Schema

Defines the structure for the overall "Other Reports" page content.

*   **overview** (`String`, required, trimmed): Overview text for the page.
*   **reports** (`Array` of `report Schema`): Embedded report documents.
*   **timestamps** (`true`): Automatically adds `createdAt` and `updatedAt` fields.

---

## collaborations/MoUs.js (`backend/models/collaborations/MoUs.js`)

This schema defines the structure for Memorandums of Understanding (MoUs).

*   **name** (`String`, required, trimmed): The name of the collaborating organization/institution.
*   **logo** (`String`, trimmed): URL to the collaborator's logo.
*   **description** (`String`, required, trimmed): Description of the MoU.
*   **signedDate** (`Date`, required): The date the MoU was signed.
*   **validUntil** (`Date`): The date the MoU is valid until.
*   **scope** (`String`, required, trimmed): The scope of the collaboration.
*   **details** (`String`, trimmed): Additional details about the MoU.
*   **international** (`Boolean`, default: `false`): Flag indicating if it's an international collaboration.
*   **status** (`String`, enum: ['Active', 'Expired', 'Under Renewal'], default: 'Active'): The current status of the MoU.
*   **isDeleted** (`Boolean`, default: `false`): Flag for soft deletion.
*   **lastUpdated** (`Date`, default: `Date.now`): Timestamp for the last update.
*   **timestamps** (`true`): Automatically adds `createdAt` and `updatedAt` fields.

---

## collaborations/academicCollaboration.js (`backend/models/collaborations/academicCollaboration.js`)

This schema defines the structure for academic collaborations.

### collaborationItem Schema (Embedded)

Defines a specific academic collaboration.

*   **name** (`String`, required, trimmed): Name of the collaborating institution.
*   **description** (`String`, required, trimmed): Description of the collaboration.
*   **type** (`String`, enum: ['Research', 'Student Exchange', 'Faculty Exchange', 'Joint Program', 'Other'], required): Type of collaboration.
*   **startDate** (`Date`): Start date of the collaboration.
*   **endDate** (`Date`): End date of the collaboration.
*   **contactPerson** (`String`, trimmed): Contact person for this collaboration.
*   **linkUrl** (`String`, trimmed): Link for more details.
*   **isDeleted** (`Boolean`, default: `false`): Flag for soft deletion.

### AcademicCollaborationsPage Schema

Defines the structure for the overall academic collaborations page content.

*   **overview** (`String`, required, trimmed): Overview text for the page.
*   **collaborations** (`Array` of `collaborationItem Schema`): Embedded collaboration documents.
*   **timestamps** (`true`): Automatically adds `createdAt` and `updatedAt` fields.

---

## collaborations/tenders.js (`backend/models/collaborations/tenders.js`)

This schema defines the structure for tenders.

*   **title** (`String`, required, trimmed): The title of the tender.
*   **fileUrl** (`String`, required, trimmed): The URL to the tender document.
*   **publishDate** (`Date`, required, default: `Date.now`): The date the tender was published.
*   **deadline** (`Date`): The submission deadline.
*   **isDeleted** (`Boolean`, default: `false`): Flag for soft deletion.
*   **lastUpdated** (`Date`, default: `Date.now`): Timestamp for the last update.
*   **timestamps** (`true`): Automatically adds `createdAt` and `updatedAt` fields.

---

## Users/User.js (`backend/models/Users/User.js`)

This schema defines the structure for user accounts.

*   **name** (`String`, required, trimmed): User's full name.
*   **email** (`String`, required, unique, trimmed, lowercase): User's email address (used as login identifier).
*   **password** (`String`, required): User's hashed password.
*   **role** (`String`, required, enum: ['student', 'faculty', 'admin', 'other'], default: 'student'): User's role.
*   **resetPasswordToken** (`String`): Token for password reset.
*   **resetPasswordExpires** (`Date`): Expiry date for the password reset token.
*   **resetRequestWindow** (`Date`): Timestamp for the start of the password reset request window (for rate limiting).
*   **resetRequestCount** (`Number`, default: 0): Counter for password reset requests within the window.
*   **timestamps** (`true`): Automatically adds `createdAt` and `updatedAt` fields.

---

## FilePath.js (`backend/models/FilePath.js`)

This schema seems intended to store file paths or URLs, possibly for general file management or uploads.

*   **name** (`String`, required, trimmed): A name or identifier for the file path.
*   **path** (`String`, required, trimmed): The actual file path or URL.
*   **uploadDate** (`Date`, default: `Date.now`): The date the path was recorded.
*   **uploadedBy** (`ObjectId`, ref: 'User`): Reference to the user who uploaded/recorded the path.
*   **isDeleted** (`Boolean`, default: `false`): Flag for soft deletion.
*   **lastUpdated** (`Date`, default: `Date.now`): Timestamp for the last update.
*   **timestamps** (`true`): Automatically adds `createdAt` and `updatedAt` fields.
