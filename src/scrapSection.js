const getValue = async (selector, fieldSelector, attribute) =>{
  if(attribute){
    return fieldSelector? await selector.$eval(fieldSelector,(el,attribute)=> {
      return el.getAttribute(attribute);     
    }
    ,attribute): await selector.evaluate((el, attribute)=>{
      return el.getAttribute(attribute);
    },attribute);
  }else{
    return fieldSelector? await selector.$eval(fieldSelector,el=> el.innerText? el.innerText.trim(): ''): await selector.evaluate(el=> el.innerText? el.innerText.trim(): '')
  }
};
const getValues = async (selector, fieldSelector, attribute) =>{
  if(attribute){
    return fieldSelector? await selector.$$eval(fieldSelector,(els,attribute) => {
      return els.map(el=> {
        return el.getAttribute(attribute);
      });
    },attribute): await selector.evaluate((el, attribute)=>{
      return el.getAttribute(attribute);
    },attribute);
  }else{
    return fieldSelector? await selector.$$eval(fieldSelector,els => els.map(el=> el.innerText? el.innerText.trim(): '')): await selector.evaluate(el=> el.innerText? el.innerText.trim(): '')
  }
};
const scrapSelectorFields = (selector, section) => async (scrapedObjectPromise, fieldKey) => {
  const scrapedObject = await scrapedObjectPromise
  const field = section.fields[fieldKey]

  // currently field can be a selector string, or an object containing a selector field
  const fieldSelectorString = await field.selector
    ? field.selector
    : typeof field ==='string'? field:'';
    
  if(fieldSelectorString){
    const isFieldPresent = await selector.$(fieldSelectorString)
    if (!isFieldPresent) { return scrapedObject }
  }

  if (field.isMultipleFields) {
    scrapedObject[fieldKey] = await getValues(selector, fieldSelectorString, field.attribute);
  }
  else{
    scrapedObject[fieldKey] = await getValue(selector, fieldSelectorString, field.attribute);
  }
   if (field.hasChildrenFields) {
    const fieldChildrenSelectors = await selector.$$(field.selector)

    scrapedObject[fieldKey] = await Promise.all(
      fieldChildrenSelectors.map((s) => scrapSelector(s, field))
    )
  }

  return scrapedObject
}
const scrapSelector = (selector, section) =>
  Object.keys(section.fields)
    .reduce(scrapSelectorFields(selector, section), Promise.resolve({}))

module.exports = async (page, section) => {
  const sectionSelectors = await page.$$(section.selector)

  const scrapedPromises = sectionSelectors
    .map((selector) => scrapSelector(selector, section))

  return Promise.all(scrapedPromises)
}
