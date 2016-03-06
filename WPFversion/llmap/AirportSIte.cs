using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace llmap
{
    class AirportSite
    {
        public string Code { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string FullSiteName { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }

        public string LatLong
        {
            get
            {
                return Latitude.ToString() + ", " + Longitude.ToString();
            }
        }
    }
}

