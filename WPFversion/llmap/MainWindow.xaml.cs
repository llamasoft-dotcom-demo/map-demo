using System;
using System.Collections.Generic;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Media.Imaging;


// This project implemts the Llamasoft map demo as a WPF application, using
// the Google Static Map API interface.
// See https://developers.google.com/maps/documentation/static-maps/intro
// for details on the Google API
//
// Copyright 2016, Jeff Spindler
////////////////////////////////

namespace llmap
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        #region members
        private int _zoom = 4;
        private AirportSite _currentSite = null;
        private List<AirportSite> _selectedSites = new List<AirportSite>();
        private string _center = "United States";
        #endregion

        public MainWindow()
        {
            InitializeComponent();
        }

        // DrawMap uses Google Static API to get
        // a map image.
        //
        // Includes markers for all cities selected via the dropdown
        // - shows red marker for the most recently selected city,
        //   and blue for the others
        //
        // Centers map on United States, unless Find button clicked,
        // in which case centers on the current city when clicked
        private void DrawMap()
        {
            string mapType = "roadmap";
            string url  = "http://maps.googleapis.com/maps/api/staticmap?" +
                    "size=640x400" +
                     "&center=" + _center + "&zoom=" + _zoom + "&maptype=" + mapType + "&sensor=false";

            // build up markers strings for current and other sites
            if (_selectedSites.Count > 0)
            { 
                string selectedMarker="&markers=color:red|" + _currentSite.LatLong + "|";
                string otherMarkers="&markers=color:blue|";

                foreach (var site in _selectedSites)
                {
                    if(site != _currentSite)
                        otherMarkers += site.LatLong + "|";
                }
                url += selectedMarker;
                if (_selectedSites.Count > 1)
                    url += otherMarkers;
            }

            BitmapImage bitmapImage = new BitmapImage();
            bitmapImage.BeginInit();
            bitmapImage.UriSource = new Uri( url );
            bitmapImage.EndInit();
            MapImage.Source = bitmapImage;
        }

        private void ZoomInButton_Click( object sender, RoutedEventArgs e )
        {
            _zoom++;
            DrawMap();
        }


        private void Window_Loaded( object sender, RoutedEventArgs e )
        {
            DrawMap();
            ClearLabels();
            LoadAirportComboBox();
        }

        private void ZoomOutButton_Click( object sender, RoutedEventArgs e )
        {
            _zoom--;
            if (_zoom <= 0)
                _zoom = 1;
            DrawMap();
        }

        private void LoadAirportComboBox()
        {
            AirportSites.Data.Sort( ( o1, o2 ) => o1.Code.CompareTo( o2.Code ) );
            AirportComboBox.ItemsSource = AirportSites.Data;
            AirportComboBox.DisplayMemberPath = "Code";
            DrawMap();
        }

        private void AirportComboBox_SelectionChanged( object sender, SelectionChangedEventArgs e )
        {
            _currentSite = (AirportSite) AirportComboBox.SelectedItem;
            if (_currentSite != null)
            {
                if (!_selectedSites.Contains( _currentSite ))
                    _selectedSites.Add( _currentSite );
                
                SetLabels();
            }
            else
            {
                ClearLabels();
            }
            DrawMap();
        }

        private void SetLabels()
        {

            SiteInfoGroupBox.Header = "Code " + _currentSite.Code;
            CityStateLabel.Content = _currentSite.City + ", " + _currentSite.State;
            FullNameLabel.Content = _currentSite.FullSiteName;
            LatLonLabel.Content = _currentSite.LatLong;
        }

        private void ClearLabels()
        {
            SiteInfoGroupBox.Header = "";
            CityStateLabel.Content = "";
            FullNameLabel.Content = "";
            LatLonLabel.Content = "";
        }

        private void ClearButton_Click( object sender, RoutedEventArgs e )
        {
            if (_selectedSites.Contains( _currentSite ))
                _selectedSites.Remove( _currentSite );
            if (_selectedSites.Count == 0)
                AirportComboBox.SelectedItem = null;
            else
                AirportComboBox.SelectedItem = _selectedSites[0];
        }

        private void MapImage_MouseWheel( object sender, System.Windows.Input.MouseWheelEventArgs e )
        {
            if (e.Delta > 0)
                _zoom++;
            else if (e.Delta < 0)
                _zoom--;

            if (_zoom <= 0)
                _zoom = 1;
            DrawMap();
        }

        private void FindButton_Click( object sender, RoutedEventArgs e )
        {
            if (_currentSite == null)
                return;

            _center = "|" + _currentSite.LatLong + "|";
            DrawMap();
        }
    }
}
