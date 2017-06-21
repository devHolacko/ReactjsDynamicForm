namespace LintsProject.Backend.Model
{
    public class Element
    {
        public string id { get; set; }
        public string type { get; set; }
        public int min { get; set; }
        public int max { get; set; }
        public object @default { get; set; }
        public string label { get; set; }
        public string description { get; set; }
        public string unit { get; set; }
        public string valueId { get; set; }
    }
}
