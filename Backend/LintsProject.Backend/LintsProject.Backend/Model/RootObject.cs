using System.Collections.Generic;

namespace LintsProject.Backend.Model
{
    public class RootObject
    {
        public List<InputGroup> InputGroups { get; set; }
        public List<Calculation> Calculations { get; set; }
    }
}
