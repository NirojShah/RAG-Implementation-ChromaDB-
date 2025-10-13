const generateId = async (model, select, key) => {
  const lastDoc = await model
    .findOne()
    .sort({ _id: -1 })
    .select(select);

  if (!lastDoc || !lastDoc[select]) {
    return `${key}_ID-1`;
  }

  const parts = lastDoc[select].split("-");
  const endNo = Number(parts[1]) || 0;

  return `${key}_ID-${endNo + 1}`;
};


module.exports= {
    generateId
}