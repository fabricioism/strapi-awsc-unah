const { sanitizeEntity } = require("strapi-utils");

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  /** UPDATE */
  async PaymentRequestUpdateEvent(ctx) {
    const { id } = ctx.params;

    let entity;

    const {
      FirstName,
      MiddleName,
      LastName,
      Email,
      PhoneNumber,
      NationalIDNumber,
      JobTitle,
      BirthDate,
      MaritalStatus,
      Gender,
      HireDate,
      SalariedFlag,
      VacationHours,
      SickLeaveHours,
      CurrentFlag,
      depto,
    } = ctx.request.body;

    /** Actualizando datos de persona */
    const employeeEntity = await strapi.services.employee.findOne({ id });
    const personData = {
      FirstName,
      MiddleName,
      LastName,
      PhoneNumber,
      Email,
    };

    console.log("employeeEntity", employeeEntity);
    console.log("employeeEntity.person", employeeEntity.person);
    console.log("employeeEntity", employeeEntity.employeedepartmenthistories);

    await strapi.services.person.update(
      { id: employeeEntity.person.id },
      personData
    );

    /** Actualizar departamento */
    if (Object.keys(depto).length) {
      let lastDepartment = [
        ...employeeEntity.employeedepartmenthistories,
      ].pop();
      await strapi.services.employeedepartmenthistory.update(
        {
          id: lastDepartment.id,
        },
        { department: parseInt(depto.value) }
      );
    }

    /** Actualizando empleado */
    const employeeData = {
      NationalIDNumber,
      JobTitle,
      BirthDate,
      MaritalStatus,
      Gender,
      HireDate,
      SalariedFlag,
      VacationHours,
      SickLeaveHours,
      CurrentFlag,
      PersonType: "EM",
      NameStyle: false,
      person: personEntity.id,
    };

    entity = await strapi.services.employee.update({ id }, employeeData);

    return sanitizeEntity(entity, { model: strapi.models.employee });
  },

  /**CREATE */
  async create(ctx) {
    let entity;

    const {
      FirstName,
      MiddleName,
      LastName,
      Email,
      PhoneNumber,
      NationalIDNumber,
      JobTitle,
      BirthDate,
      MaritalStatus,
      Gender,
      HireDate,
      SalariedFlag,
      VacationHours,
      SickLeaveHours,
      CurrentFlag,
      depto,
    } = ctx.request.body;

    const personData = { FirstName, MiddleName, LastName, PhoneNumber, Email };

    /** Inicio Creando la persona */
    const personEntity = await strapi.services.person.create(personData);
    /** Fin Creando la persona */

    /** Creando el empleado */
    const employeeData = {
      NationalIDNumber,
      JobTitle,
      BirthDate,
      MaritalStatus,
      Gender,
      HireDate,
      SalariedFlag,
      VacationHours,
      SickLeaveHours,
      CurrentFlag,
      PersonType: "EM",
      NameStyle: false,
      person: personEntity.id,
    };

    entity = await strapi.services.employee.create(employeeData);
    /** Fin Creando el empleado */

    if (Object.keys(depto).length) {
      await strapi.services.employeedepartmenthistory.create({
        employee: entity.id,
        department: parseInt(depto.value),
      });
    }
    return sanitizeEntity(entity, { model: strapi.models.employee });
  },
};
