using System.Collections.Generic;

namespace LintsProject.Backend.Model
{
    public class InputGroup
    {
        public string name { get; set; }
        public string subtitle { get; set; }
        public List<Element> elements { get; set; }
    }
}
