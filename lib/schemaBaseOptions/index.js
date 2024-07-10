const JSON_HIDDEN_FIELDS = ["createdAt", "updatedAt", "__v", "password"];

module.exports = {
    // timestamps: true,
    toJSON: {
        transform: (doc, ret) => {
            const filteredObject = { ...ret };
            JSON_HIDDEN_FIELDS.forEach(field => {
                delete filteredObject[field];
            });
            return filteredObject;
        }
    }
};