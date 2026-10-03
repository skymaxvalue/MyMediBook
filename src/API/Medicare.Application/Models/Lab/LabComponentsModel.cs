namespace Medicare.Application.Models.Lab
{
    public class LabTestCategoryModel
    {
        public int TestId { get; set; }
        public string TestCode { get; set; }
        public string TestName { get; set; }
        public List<LabTestComponentsModel> Components { get; set; }
    }
    public class LabTestComponentsModel
    {
        public int ComponentId { get; set; }
        public string ComponentName { get; set; }
        public int UnitId { get; set; }
        public string UnitName { get; set; }
        public int DisplayOrder { get; set; }
    }
    public class LabTestComponentsModelDto
    {
        public int TestId { get; set; }
        public string TestCode { get; set; }
        public string TestName { get; set; }
        public int ComponentId { get; set; }
        public string ComponentName { get; set; }
        public int UnitId { get; set; }
        public string UnitName { get; set; }
        public int DisplayOrder { get; set; }
    }
}
