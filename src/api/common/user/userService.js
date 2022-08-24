const UserRepository = require('./userRepository');

const SettingService = require('../settings/settingsService');

const settingService = new SettingService();

class UserService {
  constructor() {
    this.repository = new UserRepository();
  }

  getCount() {
    return this.repository.getCount();
  }

  findByEmail(email) {
    return this.repository.findByEmail(email);
  }

  findById(id) {
    return this.repository.findById(id)
      .then(user => this.mapUserToDto(user));
  }

  addUser(user) {
    return this.repository.add(user);
  }

  addMany(users) {
    return this.repository.addMany(users);
  }

  editUser(dto) {
    const user = this.mapDtoToUser(dto);
    return this.repository.edit(dto.id, user);
  }

  deleteUser(id) {
    return this.repository.delete(id);
  }

  changePassword(id, salt, passwordHash) {
    return this.repository.changePassword(id, salt, passwordHash);
  }

  getPhoto(userId) {
    return this.repository.getPhoto(userId);
  }

  list(filter) {
    return Promise.all([
      this.repository.listFiltered(filter),
      this.repository.getCountFiltered(filter),
    ])
      .then(([data, count]) => {
        return {
          items: data.map(item => this.mapUserToDto(item)),
          totalCount: count,
        };
      });
  }

  mapUserToDto(user) {
    return user ? {
      id: user._id,
      email: user.email,
      role: user.role,
      age: user.age,
      mobile: user.mobile,
      academicYear : user.academicYear,
      panId : user.panId,
      login: user.login,
      fullName: user.fullName,
      firstName: user.firstName,
      lastName: user.lastName,
      loginCount: user.loginCount ,
	    onboarding: user.onboarding,
      address: user.address || {},
      bankDetails: user.bankDetails || {},
      settings: settingService.mapSettingsToDto(this.getSettings(user.settings)),
      status: user.status,
      departmentName : user.departmentName,
      courseName : user.courseName,
      courseId :user.courseId,
      studentId : user.studentId,
      altemail : user.altemail,
      altmobile :user.altmobile,
      dateOfBirth : user.dateOfBirth,
      gender :user.gender,
      aadhar :user.aadhar,
      linkedinlink : user.linkedinlink,
      jobDescreption : user.jobDescreption,
      experience : user.experience,
    } : {};
  }

  getSettings(settings) {
    return settings && settings.length ? settings[0] : settings;
  }

  mapDtoToUser(dto) {
    return dto ? {
      email: dto.email,
      age: dto.age,
      role: dto.role,
      login: dto.login,
      mobile: dto.mobile,
      panId : dto.panId,
      fullName: dto.fullName,
      firstName: dto.firstName,
      lastName: dto.lastName,
      address: dto.address,
      academicYear : dto.academicYear,
      bankDetails: dto.bankDetails,
      loginCount:dto.loginCount,
      onboarding:dto.onboarding,
      departmentName : dto.departmentName,
      courseName : dto.courseName,
      courseId :dto.courseId,
      studentId : dto.studentId,
      altemail : dto.altemail,
      altmobile :dto.altmobile,
      dateOfBirth : dto.dateOfBirth,
      gender :dto.gender,
      aadhar :dto.aadhar,
      linkedinlink : dto.linkedinlink,
      jobDescreption : dto.jobDescreption,
      experience : dto.experience,
    } : {};
  }
}

module.exports = UserService;
