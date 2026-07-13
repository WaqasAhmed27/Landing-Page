import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf-8');

// How It Works section closing
content = content.replace(
  '            <p className="text-lg font-medium text-gray-800">One tap opens the receipt in the browser. No app, no account, no friction. Searchable and stored forever.</p>\n          </div>\n        </div>\n      </section>',
  '            <p className="text-lg font-medium text-gray-800">One tap opens the receipt in the browser. No app, no account, no friction. Searchable and stored forever.</p>\n          </div>\n        </div>\n        </div>\n      </section>'
);

// Get in touch section extra </div> closing issue
// Near end of file:
/*
600:         </footer>
601:         </div>
602:       </section>
603: 
604:         </div>
605:     </div>
606:   );
607: }
*/
content = content.replace(
  '        </footer>\n        </div>\n      </section>\n\n        </div>\n    </div>\n  );\n}',
  '        </footer>\n        </div>\n      </section>\n\n    </div>\n    </div>\n  );\n}'
);

fs.writeFileSync('src/App.tsx', content);
