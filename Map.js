(function AirportDropDown($, AirPortmarker, global){

    function CreateDropDown() {
        let AllOps = $.map(sites, function(x,index) {
          return {code: x.Code,label:`${x.Code} - ${x.City}`}  
        } );   

        const sel = $('#airport-list').selectize({
            valueField: 'code',
            labelField: 'label',
            options: AllOps,
            searchField: ['code', 'label'],
            sortField: 'text',
            onChange: function(airPort){
                console.log('test');
                AirPortmarker.MarkAirport(airPort);
                
                let ctrl = sel[0].selectize;                
                ctrl.clear();
            },
            open: CorrectAbnormalScrolling              
        });
    };

    function CorrectAbnormalScrolling(){
    //taken from issue #889's proposed solution
            //this prevents the screen from scolling when inside the select
            var self = this;
            if (self.isLocked || self.isOpen || (self.settings.mode === 'multi' && self.isFull())) return;
            self.focus();
            self.isOpen = true;
            self.refreshState();
            self.$dropdown.css({ visibility: 'hidden', display: 'block' });
            self.positionDropdown();
            self.$dropdown.css({ visibility: 'visible' });
            self.trigger('dropdown_open', self.$dropdown);

            //byBerny: disable scroll on page
            self.$dropdown_content.on('mousewheel', function(e) {
                var event = e.originalEvent, d = event.wheelDelta || -event.detail;
                this.scrollTop += (d < 0 ? 1 : -1) * 30;
                e.preventDefault();
            });
        //End issue #889's fix
    };
    
    
    global.initMap = function  initialize() {     
         console.log('init map tirewqreqrqweme!') 
         $(function(){
             console.log('init map time!')
            // Callback function to create a map object and specify the DOM element for display.
            AirPortmarker.AssociateWithMap( new google.maps.Map(document.getElementById('airport-map'), {
                center: {lat: 42.2814, lng: -83.7483},
                scrollwheel: true,
                zoom: 6
            }));            
            CreateDropDown();
        }); 
    }

    

       

})(jQuery, AirPortmarker, window);


$(function() {  
    $('#hideInstructions').click(function TransitionFromInstructionsToAirportSelector() {      
        $("#airport-data").fadeOut(200);
        $("#airport-controls").fadeOut(200);
        $('#exercise-description').fadeOut(500,function done(){        
            $('#hideInstructions').off('click');
            $('#exercise-description').remove();    
            $("#airport-controls").appendTo('#left-col')   
            $("#airport-data").appendTo('#left-col')    
            $("#airport-data").fadeIn(400);
            $("#airport-controls").fadeIn(400);
        });    
    });
});

